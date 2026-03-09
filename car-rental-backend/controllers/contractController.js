import Booking from '../models/Booking.js';
import docusign from 'docusign-esign';
import { configureDocuSign, getJWTToken, getUserInfo } from '../utils/docusignClient.js';
import { generateContractPDF } from '../utils/contractPDF.js';
import fs from 'fs';
import path from 'path';

// @desc    Generate rental contract
// @route   POST /api/contracts/generate
// @access  Private
export const generateContract = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('user')
      .populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate contract content
    const contractData = {
      bookingId: booking._id,
      contractNumber: `RC-${Date.now()}`,
      generatedAt: new Date(),
      
      // Parties
      renter: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
        address: booking.user.address,
      },
      owner: {
        name: booking.car.owner?.name || 'DriveEasy',
        email: booking.car.owner?.email || 'owner@driveeasy.com',
      },
      
      // Vehicle details
      vehicle: {
        name: booking.car.name,
        brand: booking.car.brand,
        model: booking.car.model,
        year: booking.car.year,
        licensePlate: booking.car.licensePlate,
      },
      
      // Rental details
      rental: {
        startDate: booking.startDate,
        endDate: booking.endDate,
        pickupLocation: booking.pickupLocation,
        deliveryOption: booking.deliveryOption,
        totalPrice: booking.totalPrice,
      },
      
      // Terms
      terms: generateContractTerms(),
    };

    // Update booking with contract data
    booking.contract = {
      contractNumber: contractData.contractNumber,
      generatedAt: contractData.generatedAt,
      status: 'pending',
    };
    await booking.save();

    res.json({
      message: 'Contract generated successfully',
      contract: contractData,
    });
  } catch (error) {
    console.error('Contract generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send contract for signature (DocuSign)
// @route   POST /api/contracts/send-for-signature
// @access  Private
export const sendForSignature = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('user')
      .populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if DocuSign is configured
    const isDocuSignConfigured = process.env.DOCUSIGN_INTEGRATION_KEY && 
                                  process.env.DOCUSIGN_USER_ID;

    if (!isDocuSignConfigured) {
      // Fallback: Simulate the process for development
      const envelopeId = `ENV-${Date.now()}`;
      const signingUrl = `${process.env.FRONTEND_URL}/sign-contract/${envelopeId}`;

      if (!booking.contract) {
        booking.contract = {};
      }
      
      booking.contract.envelopeId = envelopeId;
      booking.contract.status = 'sent';
      booking.contract.sentAt = new Date();
      booking.contract.signingUrl = signingUrl;
      
      await booking.save();

      return res.json({
        message: 'Contract sent for signature (Development Mode)',
        envelopeId,
        signingUrl,
        mode: 'development',
      });
    }

    // Production: Use DocuSign API
    try {
      // Configure DocuSign
      const apiClient = configureDocuSign();
      const accessToken = await getJWTToken();
      const userInfo = await getUserInfo(accessToken);
      const accountId = userInfo.accounts[0].accountId;

      // Generate contract data
      const contractData = {
        bookingId: booking._id,
        contractNumber: booking.contract?.contractNumber || `RC-${Date.now()}`,
        generatedAt: booking.contract?.generatedAt || new Date(),
        renter: {
          name: booking.user.name,
          email: booking.user.email,
          phone: booking.user.phone,
          address: booking.user.address,
        },
        owner: {
          name: booking.car.owner?.name || 'DriveEasy',
          email: booking.car.owner?.email || process.env.OWNER_EMAIL || 'owner@driveeasy.com',
        },
        vehicle: {
          name: booking.car.name,
          brand: booking.car.brand,
          model: booking.car.model,
          year: booking.car.year,
          licensePlate: booking.car.licensePlate,
        },
        rental: {
          startDate: booking.startDate,
          endDate: booking.endDate,
          pickupLocation: booking.pickupLocation,
          deliveryOption: booking.deliveryOption,
          totalPrice: booking.totalPrice,
        },
        terms: generateContractTerms(),
      };

      // Generate PDF
      const { filePath } = await generateContractPDF(contractData);
      const pdfBytes = fs.readFileSync(filePath);
      const pdfBase64 = pdfBytes.toString('base64');

      // Create envelope definition
      const envelopeDefinition = new docusign.EnvelopeDefinition();
      envelopeDefinition.emailSubject = `Rental Agreement - ${booking.car.name}`;
      envelopeDefinition.status = 'sent';

      // Add document
      const doc = new docusign.Document();
      doc.documentBase64 = pdfBase64;
      doc.name = `Rental_Agreement_${contractData.contractNumber}.pdf`;
      doc.fileExtension = 'pdf';
      doc.documentId = '1';
      envelopeDefinition.documents = [doc];

      // Add signer
      const signer = new docusign.Signer();
      signer.email = booking.user.email;
      signer.name = booking.user.name;
      signer.recipientId = '1';
      signer.routingOrder = '1';
      signer.clientUserId = booking.user._id.toString(); // For embedded signing

      // Add signature tab
      const signHere = new docusign.SignHere();
      signHere.documentId = '1';
      signHere.pageNumber = '1';
      signHere.recipientId = '1';
      signHere.tabLabel = 'SignHereTab';
      signHere.xPosition = '100';
      signHere.yPosition = '650';

      const tabs = new docusign.Tabs();
      tabs.signHereTabs = [signHere];
      signer.tabs = tabs;

      // Add recipients
      const recipients = new docusign.Recipients();
      recipients.signers = [signer];
      envelopeDefinition.recipients = recipients;

      // Send envelope
      const envelopesApi = new docusign.EnvelopesApi(apiClient);
      const results = await envelopesApi.createEnvelope(accountId, {
        envelopeDefinition,
      });

      const envelopeId = results.envelopeId;

      // Get recipient view (signing URL)
      const viewRequest = new docusign.RecipientViewRequest();
      viewRequest.returnUrl = `${process.env.FRONTEND_URL}/booking-success?bookingId=${bookingId}`;
      viewRequest.authenticationMethod = 'none';
      viewRequest.email = booking.user.email;
      viewRequest.userName = booking.user.name;
      viewRequest.clientUserId = booking.user._id.toString();

      const recipientView = await envelopesApi.createRecipientView(accountId, envelopeId, {
        recipientViewRequest: viewRequest,
      });

      const signingUrl = recipientView.url;

      // Update booking
      if (!booking.contract) {
        booking.contract = {};
      }
      
      booking.contract.envelopeId = envelopeId;
      booking.contract.status = 'sent';
      booking.contract.sentAt = new Date();
      booking.contract.signingUrl = signingUrl;
      
      await booking.save();

      // Clean up temporary PDF
      fs.unlinkSync(filePath);

      res.json({
        message: 'Contract sent for signature',
        envelopeId,
        signingUrl,
        mode: 'production',
      });
    } catch (docusignError) {
      console.error('DocuSign API Error:', docusignError);
      throw new Error(`DocuSign error: ${docusignError.message}`);
    }
  } catch (error) {
    console.error('Send for signature error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contract status
// @route   GET /api/contracts/:bookingId/status
// @access  Private
export const getContractStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .select('contract')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      status: booking.contract?.status || 'not_generated',
      contract: booking.contract,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Webhook handler for DocuSign events
// @route   POST /api/contracts/webhook
// @access  Public (verified by DocuSign signature)
export const handleContractWebhook = async (req, res) => {
  try {
    const event = req.body;

    // In production, verify DocuSign webhook signature
    
    // Handle different events
    switch (event.event) {
      case 'envelope-sent':
        await handleEnvelopeSent(event);
        break;
      case 'envelope-delivered':
        await handleEnvelopeDelivered(event);
        break;
      case 'envelope-completed':
        await handleEnvelopeCompleted(event);
        break;
      case 'envelope-declined':
        await handleEnvelopeDeclined(event);
        break;
      case 'envelope-voided':
        await handleEnvelopeVoided(event);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sign contract (simulated)
// @route   POST /api/contracts/sign
// @access  Private
export const signContract = async (req, res) => {
  try {
    const { bookingId, signature } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update contract status
    if (!booking.contract) {
      return res.status(400).json({ message: 'Contract not generated' });
    }

    booking.contract.status = 'signed';
    booking.contract.signedAt = new Date();
    booking.contract.signedBy = req.user._id;
    booking.contract.signature = signature;

    // Update booking status
    booking.status = 'confirmed';

    await booking.save();

    res.json({
      message: 'Contract signed successfully',
      contract: booking.contract,
    });

    // TODO: Generate and store signed PDF
    // TODO: Send confirmation email
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download signed contract
// @route   GET /api/contracts/:bookingId/download
// @access  Private
export const downloadContract = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('user')
      .populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!booking.contract || booking.contract.status !== 'signed') {
      return res.status(400).json({ message: 'Contract not signed yet' });
    }

    // In production, retrieve signed PDF from DocuSign or storage
    // For now, return contract data
    res.json({
      message: 'Contract ready for download',
      contractUrl: booking.contract.signedDocumentUrl || '#',
      contract: booking.contract,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: Generate contract terms
const generateContractTerms = () => {
  return {
    rentalPeriod: 'The rental period begins and ends at the times specified in the booking.',
    payment: 'Full payment must be received before vehicle pickup.',
    insurance: 'Basic insurance is included. Additional coverage available.',
    fuelPolicy: 'Vehicle must be returned with the same fuel level as pickup.',
    mileage: 'Unlimited mileage included unless otherwise specified.',
    damages: 'Renter is responsible for any damages during rental period.',
    cancellation: 'Free cancellation up to 24 hours before pickup.',
    lateReturn: 'Late returns may incur additional charges.',
    restrictions: 'Vehicle must not be used for illegal purposes or racing.',
    jurisdiction: 'This agreement is governed by local laws.',
  };
};

// Webhook helpers
const handleEnvelopeSent = async (event) => {
  const envelopeId = event.data.envelopeId;
  const booking = await Booking.findOne({ 'contract.envelopeId': envelopeId });
  
  if (booking) {
    booking.contract.status = 'sent';
    await booking.save();
    console.log(`✉️ Contract sent for booking ${booking._id}`);
  }
};

const handleEnvelopeDelivered = async (event) => {
  const envelopeId = event.data.envelopeId;
  const booking = await Booking.findOne({ 'contract.envelopeId': envelopeId });
  
  if (booking) {
    booking.contract.status = 'delivered';
    await booking.save();
    console.log(`📬 Contract delivered for booking ${booking._id}`);
  }
};

const handleEnvelopeCompleted = async (event) => {
  const envelopeId = event.data.envelopeId;
  const booking = await Booking.findOne({ 'contract.envelopeId': envelopeId });
  
  if (booking) {
    booking.contract.status = 'signed';
    booking.contract.signedAt = new Date();
    booking.contract.signedDocumentUrl = event.data.documentUrl;
    booking.status = 'confirmed';
    await booking.save();
    console.log(`✅ Contract signed for booking ${booking._id}`);
    
    // TODO: Download and store signed PDF
    // TODO: Send confirmation email
  }
};

const handleEnvelopeDeclined = async (event) => {
  const envelopeId = event.data.envelopeId;
  const booking = await Booking.findOne({ 'contract.envelopeId': envelopeId });
  
  if (booking) {
    booking.contract.status = 'declined';
    booking.contract.declinedAt = new Date();
    booking.contract.declineReason = event.data.reason;
    await booking.save();
    console.log(`❌ Contract declined for booking ${booking._id}`);
  }
};

const handleEnvelopeVoided = async (event) => {
  const envelopeId = event.data.envelopeId;
  const booking = await Booking.findOne({ 'contract.envelopeId': envelopeId });
  
  if (booking) {
    booking.contract.status = 'voided';
    booking.contract.voidedAt = new Date();
    await booking.save();
    console.log(`🚫 Contract voided for booking ${booking._id}`);
  }
};
