import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a car name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please provide price per day'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  seats: {
    type: Number,
    required: true,
    min: 2,
    max: 15,
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury', 'Electric'],
    required: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Car',
  },
  images: [{
    type: String,
  }],
  features: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  mileage: {
    type: Number,
    default: 0,
  },
  licensePlate: {
    type: String,
    unique: true,
    sparse: true,
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for search
carSchema.index({ name: 'text', description: 'text', location: 'text' });

const Car = mongoose.model('Car', carSchema);

export default Car;
