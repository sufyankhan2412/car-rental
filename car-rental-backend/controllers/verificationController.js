import Stripe from 'stripe';
import User from '../models/User.js';

// Initialize Stripe with lazy loading
let stripe;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// @desc    Create Stripe Identity verification session
// @route   POST /api/verification/create-session
// @access  Private
export const createVerificationSession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.verificationStatus === 'verified') {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Create Stripe Identity verification session
    const verificationSession = await getStripe().identity.verificationSessions.create({
      type: 'document',
      metadata: {
        userId: user._id.toString(),
        email: user.email,
      },
      options: {
        document: {
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
    });

    // Update user with session ID
    user.verificationSessionId = verificationSession.id;
    user.verificationStatus = 'pending';
    await user.save();

    res.json({
      sessionId: verificationSession.id,
      clientSecret: verificationSession.client_secret,
      url: verificationSession.url,
    });
  } catch (error) {
    console.error('Verification session error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle verification webhook
// @route   POST /api/verification/webhook
// @access  Public (verified by Stripe signature)
export const handleVerificationWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_VERIFICATION_WEBHOOK_SECRET;

  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'identity.verification_session.verified':
      const verifiedSession = event.data.object;
      await handleVerificationSuccess(verifiedSession);
      break;

    case 'identity.verification_session.requires_input':
      const requiresInputSession = event.data.object;
      await handleVerificationRequiresInput(requiresInputSession);
      break;

    case 'identity.verification_session.canceled':
      const canceledSession = event.data.object;
      await handleVerificationCanceled(canceledSession);
      break;

    default:
      console.log(`Unhandled verification event type ${event.type}`);
  }

  res.json({ received: true });
};

// Helper: Handle successful verification
const handleVerificationSuccess = async (session) => {
  try {
    const userId = session.metadata.userId;

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    // Update user verification status
    user.verificationStatus = 'verified';
    user.isVerified = true;
    user.verifiedAt = new Date();
    
    // Store verification details
    if (!user.verificationDocuments) {
      user.verificationDocuments = [];
    }
    
    user.verificationDocuments.push({
      type: 'identity',
      status: 'approved',
      verificationSessionId: session.id,
      verifiedAt: new Date(),
    });

    await user.save();

    console.log(`✅ User ${userId} verified successfully`);

    // TODO: Send verification success email
  } catch (error) {
    console.error('Error handling verification success:', error);
  }
};

// Helper: Handle verification requires input
const handleVerificationRequiresInput = async (session) => {
  try {
    const userId = session.metadata.userId;

    const user = await User.findById(userId);
    if (!user) {
      return;
    }

    user.verificationStatus = 'pending';
    await user.save();

    console.log(`⏳ Verification requires input for user ${userId}`);

    // TODO: Send email to user to complete verification
  } catch (error) {
    console.error('Error handling verification requires input:', error);
  }
};

// Helper: Handle verification canceled
const handleVerificationCanceled = async (session) => {
  try {
    const userId = session.metadata.userId;

    const user = await User.findById(userId);
    if (!user) {
      return;
    }

    user.verificationStatus = 'rejected';
    await user.save();

    console.log(`❌ Verification canceled for user ${userId}`);
  } catch (error) {
    console.error('Error handling verification canceled:', error);
  }
};

// @desc    Get verification status
// @route   GET /api/verification/status
// @access  Private
export const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('verificationStatus isVerified verifiedAt verificationDocuments');

    res.json({
      status: user.verificationStatus || 'unverified',
      isVerified: user.isVerified || false,
      verifiedAt: user.verifiedAt,
      documents: user.verificationDocuments || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload verification document (alternative to Stripe Identity)
// @route   POST /api/verification/upload-document
// @access  Private
export const uploadVerificationDocument = async (req, res) => {
  try {
    const { type, url } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add document to user
    if (!user.verificationDocuments) {
      user.verificationDocuments = [];
    }

    user.verificationDocuments.push({
      type,
      url,
      status: 'pending',
      uploadedAt: new Date(),
    });

    user.verificationStatus = 'pending';
    await user.save();

    res.json({
      message: 'Document uploaded successfully',
      status: 'pending',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all pending verifications
// @route   GET /api/verification/pending
// @access  Private/Admin
export const getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({
      verificationStatus: 'pending',
    }).select('name email verificationDocuments verificationStatus createdAt');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Approve/Reject verification
// @route   PUT /api/verification/:userId/status
// @access  Private/Admin
export const updateVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationStatus = status;
    user.isVerified = status === 'verified';

    if (status === 'verified') {
      user.verifiedAt = new Date();
    }

    // Update document status
    if (user.verificationDocuments && user.verificationDocuments.length > 0) {
      user.verificationDocuments[user.verificationDocuments.length - 1].status = 
        status === 'verified' ? 'approved' : 'rejected';
      
      if (reason) {
        user.verificationDocuments[user.verificationDocuments.length - 1].rejectionReason = reason;
      }
    }

    await user.save();

    res.json({
      message: `Verification ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
      },
    });

    // TODO: Send email notification to user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
