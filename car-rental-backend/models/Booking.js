import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date'],
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please provide pickup location'],
  },
  deliveryOption: {
    type: Boolean,
    default: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  paymentIntentId: {
    type: String,
  },
  extras: {
    insurance: {
      type: Boolean,
      default: false,
    },
    gps: {
      type: Boolean,
      default: false,
    },
    childSeat: {
      type: Boolean,
      default: false,
    },
  },
  notes: {
    type: String,
  },
  cancellationReason: {
    type: String,
  },
  cancelledAt: {
    type: Date,
  },
  contract: {
    contractNumber: String,
    generatedAt: Date,
    status: {
      type: String,
      enum: ['not_generated', 'pending', 'sent', 'delivered', 'signed', 'declined', 'voided'],
      default: 'not_generated',
    },
    envelopeId: String,
    sentAt: Date,
    signedAt: Date,
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    signedDocumentUrl: String,
    signingUrl: String,
    declinedAt: Date,
    declineReason: String,
    voidedAt: Date,
    voidReason: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ car: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
