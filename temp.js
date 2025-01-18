const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('../models/customer'); // Import the Customer model
const Seller = require('../models/seller'); // Import the Seller model

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ondcData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Convert string date to Date object
const dateString = "27/02/2005";
const [day, month, year] = dateString.split('/');
const formattedDate = new Date(`${year}-${month}-${day}`);

// Function to insert a new customer and seller
async function insertData() {
    // Insert a new customer
  

    // Insert a new seller
    const seller = new Seller({
        shopName: 'Anaya\'s Boutique',
        ownerName: 'Anaya Shukla',
        dob: new Date('1990-05-15'),
        pincode: '12345',
        location: 'shop no. 162, Kamla Nagar, New Delhi, India',
        kyc: {
            gst: '27AAAAA1234A1Z5', // Valid GSTIN
            pan: 'ABCDE1234F', // Valid PAN
            aadhar: '234567890123', // Valid Aadhaar (starts with 2-9)
            passport: 'A1234567', // Valid Passport
            bankDetails: '9876543210', // Valid Bank Account
        },
        profilePicture: 'profile.jpg',
        description: 'A boutique offering a variety of clothing and accessories.',
        operationalHours: '10 AM - 8 PM',
      });
      

    // Save seller to database
    try {
        const savedSeller = await seller.save();
        console.log('Seller inserted successfully:', savedSeller);
    } catch (error) {
        console.error('Error inserting seller:', error);
    }

    // Close the database connection
    mongoose.connection.close();
}

// Call the function to insert data
insertData();
