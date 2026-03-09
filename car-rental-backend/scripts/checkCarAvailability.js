import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';

dotenv.config();

const checkAvailability = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check all cars
    const allCars = await Car.find();
    console.log(`Total cars: ${allCars.length}`);
    
    const availableCars = await Car.find({ available: true });
    console.log(`Available cars: ${availableCars.length}`);
    
    const unavailableCars = await Car.find({ available: false });
    console.log(`Unavailable cars: ${unavailableCars.length}\n`);

    if (unavailableCars.length > 0) {
      console.log('Unavailable cars:');
      unavailableCars.forEach(car => {
        console.log(`- ${car.name} (${car._id})`);
      });
      console.log('');
    }

    // Check confirmed bookings
    const confirmedBookings = await Booking.find({ 
      status: 'confirmed',
      paymentStatus: 'paid'
    }).populate('car', 'name available');
    
    console.log(`Confirmed bookings: ${confirmedBookings.length}`);
    if (confirmedBookings.length > 0) {
      console.log('\nConfirmed bookings:');
      confirmedBookings.forEach(booking => {
        console.log(`- Booking ${booking._id.toString().slice(-8)}`);
        console.log(`  Car: ${booking.car?.name || 'N/A'}`);
        console.log(`  Car Available: ${booking.car?.available}`);
        console.log(`  Payment: ${booking.paymentStatus}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAvailability();
