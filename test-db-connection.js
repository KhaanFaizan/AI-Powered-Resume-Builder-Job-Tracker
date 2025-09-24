#!/usr/bin/env node

/**
 * Test MongoDB Atlas connection
 * Run this to verify your database connection works
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Faizan:GEdrsyJKBENia7pT@resumebuilder.mvq5mbw.mongodb.net/?retryWrites=true&w=majority&appName=resumebuilder';

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('MongoDB URI:', MONGODB_URI ? 'Found' : 'Not found');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully!');
  console.log('Database name:', mongoose.connection.db.databaseName);
  console.log('Connection state:', mongoose.connection.readyState);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.error('Full error:', error);
  process.exit(1);
});
