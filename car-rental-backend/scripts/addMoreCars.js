import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const newCars = [
  {
    name: 'Porsche 911 Carrera',
    brand: 'Porsche',
    model: '911 Carrera',
    year: 2024,
    pricePerDay: 350,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    vehicleType: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 4,
    description: 'Experience the legendary Porsche 911 with its iconic design and exhilarating performance. Perfect for those who demand the best.',
    features: ['Premium Sound System', 'Sport Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Leather Interior'],
    location: 'Los Angeles, CA',
    available: true,
  },
  {
    name: 'Range Rover Sport',
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2024,
    pricePerDay: 280,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    vehicleType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 7,
    description: 'Luxury SUV with commanding presence and exceptional off-road capability. Perfect for family adventures or executive travel.',
    features: ['4WD', 'Panoramic Sunroof', 'Premium Audio', 'Heated Seats', 'Navigation', 'Parking Sensors'],
    location: 'New York, NY',
    available: true,
  },
  {
    name: 'Chevrolet Corvette Stingray',
    brand: 'Chevrolet',
    model: 'Corvette Stingray',
    year: 2024,
    pricePerDay: 320,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    vehicleType: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 2,
    description: 'American supercar with breathtaking performance and head-turning style. Mid-engine design delivers incredible handling.',
    features: ['Performance Exhaust', 'Sport Suspension', 'Premium Interior', 'Digital Cockpit', 'Launch Control'],
    location: 'Miami, FL',
    available: true,
  },
  {
    name: 'Jeep Wrangler Unlimited',
    brand: 'Jeep',
    model: 'Wrangler Unlimited',
    year: 2024,
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    vehicleType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    description: 'Iconic off-road vehicle perfect for adventure seekers. Removable top and doors for the ultimate open-air experience.',
    features: ['4WD', 'Removable Top', 'Off-Road Package', 'Bluetooth', 'Backup Camera', 'All-Terrain Tires'],
    location: 'Denver, CO',
    available: true,
  },
  {
    name: 'Lexus ES 350',
    brand: 'Lexus',
    model: 'ES 350',
    year: 2024,
    pricePerDay: 140,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    vehicleType: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    description: 'Luxury sedan combining comfort, reliability, and fuel efficiency. Perfect for business travel or long-distance trips.',
    features: ['Leather Seats', 'Sunroof', 'Premium Audio', 'Adaptive Cruise Control', 'Lane Assist', 'Heated Seats'],
    location: 'San Francisco, CA',
    available: true,
  },
  {
    name: 'Volkswagen ID.4',
    brand: 'Volkswagen',
    model: 'ID.4',
    year: 2024,
    pricePerDay: 95,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
    vehicleType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    description: 'All-electric SUV with impressive range and modern technology. Eco-friendly choice without compromising on space or comfort.',
    features: ['Electric', '250+ Mile Range', 'Fast Charging', 'Digital Cockpit', 'Autopilot', 'Panoramic Roof'],
    location: 'Seattle, WA',
    available: true,
  },
  {
    name: 'Mazda CX-5',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2024,
    pricePerDay: 85,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    vehicleType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    description: 'Stylish compact SUV with excellent handling and premium interior. Great fuel economy and reliability.',
    features: ['Apple CarPlay', 'Android Auto', 'Blind Spot Monitoring', 'Rear Cross Traffic Alert', 'Keyless Entry'],
    location: 'Chicago, IL',
    available: true,
  },
  {
    name: 'Cadillac Escalade',
    brand: 'Cadillac',
    model: 'Escalade',
    year: 2024,
    pricePerDay: 300,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    vehicleType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 8,
    description: 'Full-size luxury SUV with commanding presence and ultimate comfort. Perfect for VIP transportation or large groups.',
    features: ['Captain Chairs', 'Entertainment System', 'Premium Audio', 'Adaptive Suspension', 'Night Vision', 'Massage Seats'],
    location: 'Las Vegas, NV',
    available: true,
  },
];

const addCars = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    console.log('Adding new cars...\n');

    for (const carData of newCars) {
      // Check if car already exists
      const existing = await Car.findOne({ 
        brand: carData.brand, 
        model: carData.model 
      });

      if (existing) {
        console.log(`⚠️  ${carData.name} already exists, skipping...`);
        continue;
      }

      const car = await Car.create(carData);
      console.log(`✅ Added: ${car.name} - $${car.pricePerDay}/day`);
    }

    console.log('\n✨ All cars added successfully!');
    
    // Show total count
    const totalCars = await Car.countDocuments();
    console.log(`\n📊 Total cars in system: ${totalCars}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addCars();
