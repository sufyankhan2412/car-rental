import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';

dotenv.config();

const checkBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const allBookings = await Booking.find().populate('car', 'name').populate('user', 'name email');
    
    console.log(`Total bookings: ${allBookings.length}\n`);

    if (allBookings.length > 0) {
      allBookings.forEach(booking => {
        console.log(`Booking ID: ${booking._id.toString().slice(-8)}`);
        console.log(`User: ${booking.user?.name || 'N/A'}`);
        console.log(`Car: ${booking.car?.name || 'N/A'}`);
        console.log(`Status: ${booking.status}`);
        console.log(`Payment Status: ${booking.paymentStatus}`);
        console.log(`Total Price: $${booking.totalPrice}`);
        console.log(`Created: ${booking.createdAt}`);
        console.log('---');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBookings();
