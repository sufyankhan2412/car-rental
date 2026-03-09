import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['delivery', 'airport', 'distance', 'extra'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  distanceRange: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
    },
  },
  fee: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const PricingRule = mongoose.model('PricingRule', pricingRuleSchema);

export default PricingRule;
