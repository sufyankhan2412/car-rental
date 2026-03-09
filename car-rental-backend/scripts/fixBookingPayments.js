import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

dotenv.config();

const fixPayments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all confirmed bookings with pending payment
    const bookings = await Booking.find({
      status: 'confirmed',
      paymentStatus: 'pending'
    }).populate('car');

    console.log(`Found ${bookings.length} bookings to fix\n`);

    for (const booking of bookings) {
      console.log(`Fixing booking ${booking._id.toString().slice(-8)}`);
      console.log(`Car: ${booking.car?.name}`);
      
      // Update booking payment status
      booking.paymentStatus = 'paid';
      
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
        console.log(`✅ Car ${booking.car.name} marked as unavailable`);
      }
      
      console.log('---\n');
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPayments();
