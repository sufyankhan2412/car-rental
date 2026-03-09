import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';
import User from './models/User.js';
import PricingRule from './models/PricingRule.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleCars = [
  {
    name: 'Tesla Model 3',
    description: 'Experience the future of driving with this premium electric sedan. Perfect for city commutes and long trips.',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    pricePerDay: 89,
    location: 'San Francisco, CA',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    vehicleType: 'Electric',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800',
    ],
    features: ['Autopilot', 'Premium Sound System', 'Glass Roof', 'Heated Seats', 'USB Charging'],
    rating: 4.8,
    reviews: 124,
    available: true,
    featured: true,
    mileage: 15000,
  },
  {
    name: 'BMW X5',
    description: 'Luxury SUV with spacious interior and powerful performance. Ideal for family trips.',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    pricePerDay: 120,
    location: 'Los Angeles, CA',
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    vehicleType: 'SUV',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    ],
    features: ['Leather Seats', 'Navigation', 'Backup Camera', 'Bluetooth', 'Sunroof'],
    rating: 4.7,
    reviews: 89,
    available: true,
    featured: true,
    mileage: 22000,
  },
  {
    name: 'Mercedes-Benz C-Class',
    description: 'Elegant sedan combining luxury and performance. Perfect for business trips.',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    pricePerDay: 95,
    location: 'New York, NY',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    vehicleType: 'Luxury',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    ],
    features: ['Premium Interior', 'Advanced Safety', 'Climate Control', 'Premium Audio'],
    rating: 4.9,
    reviews: 156,
    available: true,
    featured: true,
    mileage: 18000,
  },
  {
    name: 'Toyota Camry',
    description: 'Reliable and comfortable sedan. Great fuel economy for everyday use.',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 55,
    location: 'Chicago, IL',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    vehicleType: 'Sedan',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    ],
    features: ['Fuel Efficient', 'Apple CarPlay', 'Lane Assist', 'Adaptive Cruise Control'],
    rating: 4.6,
    reviews: 203,
    available: true,
    featured: false,
    mileage: 25000,
  },
  {
    name: 'Ford F-150',
    description: 'Powerful pickup truck for work and adventure. Spacious bed and towing capacity.',
    brand: 'Ford',
    model: 'F-150',
    year: 2023,
    pricePerDay: 85,
    location: 'Austin, TX',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    vehicleType: 'Truck',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    ],
    features: ['4WD', 'Towing Package', 'Bed Liner', 'Crew Cab', 'Touchscreen'],
    rating: 4.5,
    reviews: 78,
    available: true,
    featured: false,
    mileage: 30000,
  },
  {
    name: 'Honda CR-V',
    description: 'Versatile compact SUV with excellent reliability and cargo space.',
    brand: 'Honda',
    model: 'CR-V',
    year: 2023,
    pricePerDay: 65,
    location: 'Seattle, WA',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    vehicleType: 'SUV',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    ],
    features: ['All-Wheel Drive', 'Honda Sensing', 'Spacious Interior', 'Backup Camera'],
    rating: 4.7,
    reviews: 145,
    available: true,
    featured: true,
    mileage: 20000,
  },
  {
    name: 'Audi A4',
    description: 'Premium sedan with cutting-edge technology and refined performance.',
    brand: 'Audi',
    model: 'A4',
    year: 2023,
    pricePerDay: 100,
    location: 'Miami, FL',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    vehicleType: 'Luxury',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    ],
    features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Sound', 'Matrix LED Lights'],
    rating: 4.8,
    reviews: 92,
    available: true,
    featured: true,
    mileage: 16000,
  },
  {
    name: 'Chevrolet Suburban',
    description: 'Full-size SUV perfect for large families and group trips. Maximum space and comfort.',
    brand: 'Chevrolet',
    model: 'Suburban',
    year: 2023,
    pricePerDay: 110,
    location: 'Denver, CO',
    seats: 8,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    vehicleType: 'SUV',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    ],
    features: ['3rd Row Seating', 'Rear Entertainment', 'Towing Capacity', 'Power Liftgate'],
    rating: 4.6,
    reviews: 67,
    available: true,
    featured: false,
    mileage: 28000,
  },
];

const pricingRules = [
  {
    type: 'delivery',
    name: 'Short Distance Delivery',
    description: 'Delivery within 10km',
    distanceRange: { min: 0, max: 10 },
    fee: 10,
    isActive: true,
  },
  {
    type: 'delivery',
    name: 'Medium Distance Delivery',
    description: 'Delivery between 10-20km',
    distanceRange: { min: 10, max: 20 },
    fee: 20,
    isActive: true,
  },
  {
    type: 'delivery',
    name: 'Long Distance Delivery',
    description: 'Delivery between 20-50km',
    distanceRange: { min: 20, max: 50 },
    fee: 40,
    isActive: true,
  },
  {
    type: 'delivery',
    name: 'Extended Distance Delivery',
    description: 'Delivery over 50km',
    distanceRange: { min: 50, max: null },
    fee: 75,
    isActive: true,
  },
  {
    type: 'airport',
    name: 'Airport Delivery',
    description: 'Special airport delivery service',
    fee: 30,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Car.deleteMany();
    await User.deleteMany();
    await PricingRule.deleteMany();

    console.log('🗑️  Data cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@driveeasy.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
      isVerified: true,
    });

    console.log('✅ Admin user created');

    // Create sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1987654321',
      role: 'user',
      isVerified: true,
    });

    console.log('✅ Sample user created');

    // Add owner to cars
    const carsWithOwner = sampleCars.map(car => ({
      ...car,
      owner: adminUser._id,
    }));

    // Insert cars
    await Car.insertMany(carsWithOwner);

    console.log('✅ Sample cars created');

    // Insert pricing rules
    await PricingRule.insertMany(pricingRules);

    console.log('✅ Pricing rules created');
    console.log('\n📊 Database seeded successfully!');
    console.log('\n🔐 Login credentials:');
    console.log('Admin: admin@driveeasy.com / admin123');
    console.log('User: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
