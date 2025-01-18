const mongoose = require('mongoose');

// Regular expressions for validating KYC fields
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/; // GSTIN format
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN format
const aadharRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/; // Aadhaar format
const passportRegex = /^[A-Z]{1}[0-9]{7}$/; // Passport format
const bankAccountRegex = /^[0-9]{9,18}$/; // Bank account number format

const sellerSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  dob: { type: Date },
  pincode: { type: String },
  location: { type: String },
  kyc: {
    gst: { 
      type: String, 
      match: [gstRegex, 'Invalid GSTIN format'] 
    },
    pan: { 
      type: String, 
      match: [panRegex, 'Invalid PAN format'] 
    },
    aadhar: { 
      type: String, 
      match: [aadharRegex, 'Invalid Aadhaar number format'] 
    },
    passport: { 
      type: String, 
      match: [passportRegex, 'Invalid Passport number format'] 
    },
    bankDetails: { 
      type: String, 
      match: [bankAccountRegex, 'Invalid Bank Account number format'] 
    },
  },
  profilePicture: String,
  description: String,
  operationalHours: String,
  password: { type: String, required: true },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;

