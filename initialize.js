const mongoose = require('mongoose');
const dotenv = require('dotenv');
const customer=require('../models/customer');
const seller=require('../models/seller');
// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ondcData', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
   
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
