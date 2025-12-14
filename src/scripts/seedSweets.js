import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Sweet } from '../models/Sweet.js';

const seedSweets = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing sweets
    await Sweet.deleteMany({});
    console.log('✅ Cleared existing sweets');

    // Seed initial sweets
    const initialSweets = [
      {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50,
      },
      {
        name: 'Gummy Bears',
        category: 'Gummies',
        price: 1.99,
        quantity: 100,
      },
      {
        name: 'Lollipop',
        category: 'Hard Candy',
        price: 0.99,
        quantity: 200,
      },
      {
        name: 'Caramel Candy',
        category: 'Caramel',
        price: 1.49,
        quantity: 75,
      },
      {
        name: 'Jelly Beans',
        category: 'Gummies',
        price: 3.49,
        quantity: 150,
      },
      {
        name: 'Marshmallow',
        category: 'Soft Candy',
        price: 2.49,
        quantity: 80,
      },
      {
        name: 'Toffee',
        category: 'Hard Candy',
        price: 1.99,
        quantity: 60,
      },
      {
        name: 'Licorice',
        category: 'Hard Candy',
        price: 1.79,
        quantity: 90,
      },
    ];

    const createdSweets = await Sweet.insertMany(initialSweets);
    console.log(`✅ Created ${createdSweets.length} sweets`);

    // Display created sweets
    console.log('\n📦 Seeded Sweets:');
    createdSweets.forEach((sweet) => {
      console.log(`  - ${sweet.name} (${sweet.category}): $${sweet.price} - Qty: ${sweet.quantity}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sweets:', error);
    process.exit(1);
  }
};

seedSweets();

