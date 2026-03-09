import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// Initialize Stripe with lazy loading
let stripe;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('car')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Car Rental: ${booking.car.name}`,
              description: `${booking.car.brand} ${booking.car.model} - ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`,
              images: booking.car.image ? [booking.car.image] : [],
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?cancelled=true`,
      client_reference_id: bookingId,
      customer_email: booking.user.email,
      metadata: {
        bookingId: bookingId,
        userId: booking.user._id.toString(),
        carId: booking.car._id.toString(),
      },
    });

    // Update booking with session ID
    booking.paymentIntentId = session.id;
    await booking.save();

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (but verified by Stripe signature)
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      await handleExpiredSession(expiredSession);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Helper: Handle successful payment
const handleSuccessfulPayment = async (session) => {
  try {
    const bookingId = session.metadata.bookingId;

    const booking = await Booking.findById(bookingId).populate('car');
    if (!booking) {
      console.error('Booking not found:', bookingId);
      return;
    }

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paymentIntentId = session.payment_intent;
    
    // Initialize contract if not exists
    if (!booking.contract) {
      booking.contract = {
        contractNumber: `RC-${Date.now()}`,
        generatedAt: new Date(),
        status: 'pending',
      };
    }
    
    await booking.save();

    // Mark car as unavailable
    if (booking.car) {
      await Car.findByIdAndUpdate(booking.car._id, { available: false });
      console.log(`🚗 Car ${booking.car.name} marked as unavailable`);
    }

    console.log(`✅ Payment successful for booking ${bookingId}`);
    console.log(`📄 Contract initialized: ${booking.contract.contractNumber}`);

    // TODO: Send confirmation email to user
    // TODO: Send notification to car owner
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Helper: Handle expired session
const handleExpiredSession = async (session) => {
  try {
    const bookingId = session.metadata.bookingId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return;
    }

    // Update booking status
    booking.paymentStatus = 'failed';
    booking.status = 'cancelled';
    await booking.save();

    console.log(`⏰ Payment session expired for booking ${bookingId}`);
  } catch (error) {
    console.error('Error handling expired session:', error);
  }
};

// Helper: Handle failed payment
const handleFailedPayment = async (paymentIntent) => {
  try {
    // Find booking by payment intent
    const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
    if (!booking) {
      return;
    }

    // Update booking status
    booking.paymentStatus = 'failed';
    await booking.save();

    console.log(`❌ Payment failed for booking ${booking._id}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:sessionId
// @access  Private
export const getPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create payment intent (alternative to checkout)
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create payment intent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId,
        carName: booking.car.name,
      },
    });

    // Update booking
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Find and update booking
      const booking = await Booking.findOne({ paymentIntentId });

      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();
      }

      res.json({
        success: true,
        booking,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
export const getPaymentMethods = async (req, res) => {
  try {
    // In a real app, you'd store customer ID in user model
    // For now, return empty array
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add payment method
// @route   POST /api/payments/methods
// @access  Private
export const addPaymentMethod = async (req, res) => {
  try {
    // Implementation for saving payment methods
    res.json({ message: 'Payment method added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payments/methods/:id
// @access  Private
export const deletePaymentMethod = async (req, res) => {
  try {
    res.json({ message: 'Payment method deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually mark payment as complete (for testing)
// @route   POST /api/payments/mark-paid/:bookingId
// @access  Private (Admin or booking owner)
export const markPaymentComplete = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId).populate('car');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check authorization
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update payment status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    
    // Initialize contract if not exists
    if (!booking.contract) {
      booking.contract = {
        contractNumber: `RC-${Date.now()}`,
        generatedAt: new Date(),
        status: 'pending',
      };
    }
    
    await booking.save();
    
    // Mark car as unavailable
    if (booking.car) {
      await Car.findByIdAndUpdate(booking.car._id, { available: false });
    }
    
    res.json({
      message: 'Payment marked as complete',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
