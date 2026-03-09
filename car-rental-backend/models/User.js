import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified',
  },
  verificationSessionId: {
    type: String,
  },
  verifiedAt: {
    type: Date,
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['license', 'id', 'passport', 'identity'],
    },
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verificationSessionId: String,
    rejectionReason: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: Date,
  }],
  avatar: {
    type: String,
    default: '',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
