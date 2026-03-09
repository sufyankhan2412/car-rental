import PricingRule from '../models/PricingRule.js';

// @desc    Get all pricing rules
// @route   GET /api/pricing
// @access  Public
export const getPricingRules = async (req, res) => {
  try {
    const rules = await PricingRule.find({ isActive: true }).sort({ type: 1, fee: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate delivery fee based on distance
// @route   POST /api/pricing/calculate-delivery
// @access  Public
export const calculateDeliveryFee = async (req, res) => {
  try {
    const { distance, isAirport } = req.body;

    // Check for airport delivery
    if (isAirport) {
      const airportRule = await PricingRule.findOne({ type: 'airport', isActive: true });
      if (airportRule) {
        return res.json({
          fee: airportRule.fee,
          type: 'airport',
          description: airportRule.description,
        });
      }
    }

    // Find applicable distance-based rule
    const distanceRule = await PricingRule.findOne({
      type: 'delivery',
      isActive: true,
      'distanceRange.min': { $lte: distance },
      $or: [
        { 'distanceRange.max': { $gte: distance } },
        { 'distanceRange.max': null },
      ],
    }).sort({ 'distanceRange.min': -1 });

    if (distanceRule) {
      return res.json({
        fee: distanceRule.fee,
        type: 'delivery',
        description: distanceRule.description,
        distance,
      });
    }

    // Default fee if no rule matches
    res.json({
      fee: 50,
      type: 'delivery',
      description: 'Standard delivery fee',
      distance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create pricing rule
// @route   POST /api/pricing
// @access  Private/Admin
export const createPricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pricing rule
// @route   PUT /api/pricing/:id
// @access  Private/Admin
export const updatePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    Object.assign(rule, req.body);
    const updatedRule = await rule.save();

    res.json(updatedRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete pricing rule
// @route   DELETE /api/pricing/:id
// @access  Private/Admin
export const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    await rule.deleteOne();
    res.json({ message: 'Pricing rule removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
