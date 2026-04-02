const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const { categorizeItem } = require('./utils/categorize');
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kharchatrack');
    console.log('MongoDB Connected to seed data');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const txData = [
  { date: '2026-03-25T10:00:00Z', type: 'credit', item: 'Initial Credit', amount: 2500, category: 'Credit', paidFor: 'self', paidBy: 'self' },
  { date: '2026-03-31T12:00:00Z', type: 'expense', item: 'Egg curry rice', amount: 130, paidFor: 'self', paidBy: 'self' },
  { date: '2026-03-31T12:05:00Z', type: 'expense', item: 'Egg curry rice', amount: 130, paidFor: 'uma', paidBy: 'self' },
  { date: '2026-04-01T14:00:00Z', type: 'expense', item: 'Biryani', amount: 100, paidFor: 'self', paidBy: 'self' },
  { date: '2026-04-02T16:00:00Z', type: 'expense', item: 'Maggie', amount: 60, paidFor: 'self', paidBy: 'self' },
  { date: '2026-04-02T16:15:00Z', type: 'expense', item: 'Banana', amount: 20, paidFor: 'self', paidBy: 'self' },
  { date: '2026-04-02T16:30:00Z', type: 'expense', item: 'Xerox', amount: 14, paidFor: 'self', paidBy: 'self' },
  { date: '2026-04-02T17:00:00Z', type: 'expense', item: 'Panipuri', amount: 20, paidFor: 'self', paidBy: 'uma' },
];

const seedData = async () => {
  await connectDB();
  await Transaction.deleteMany();
  
  const formattedData = txData.map(tx => {
    if (tx.type === 'expense') {
      tx.category = categorizeItem(tx.item);
    }
    return tx;
  });

  await Transaction.insertMany(formattedData);
  console.log('Data Imported!');
  process.exit();
};

seedData();
