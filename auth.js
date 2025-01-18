const express = require('express');
const router = express.Router();
const { sendOtp } = require('../utils/twilio');
const crypto = require('crypto');
const authController = require('../controllers/authController');
const Seller = require('../models/seller');
const multer = require('multer');
let otpStore = {}; // Temporary store for OTPs. Use Redis for production.
let bcrypt=require('bcryptjs');
const path = require('path');
const Customer=require('../models/customer');
const { v4: uuidv4 } = require('uuid');
router.post('/register/send-otp', async (req, res) => {
  const { email, phone } = req.body;  // Get email and phone number from the form

  // Log the input to check its structure
  console.log('Received data:', { email, phone });

  // Validate phone number format (ensure it starts with +91)
  if (typeof phone !== 'string' || phone.trim().length === 0 || !phone.startsWith('+91')) {
      console.log('Invalid phone number format:', phone);
      return res.status(400).send('Invalid phone number. Ensure it starts with +91');
  }

  // Generate a 6-digit OTP and ensure it's a string
  const otp = crypto.randomInt(100000, 999999).toString();  // Generates a random OTP between 100000 and 999999
  console.log('Generated OTP:', otp);

  // Store OTP temporarily (in Redis for production, using an object for testing)
  otpStore[phone] = otp;

  // Send OTP via Twilio
  try {
      const success = await sendOtp(phone, otp);  // Call the Twilio function to send OTP

      if (success) {
          // Log success message and render the OTP verification page
          console.log('OTP sent successfully to:', phone);
          res.render('verifyOtp', { phone, email });
      } else {
          // Log failure message
          console.log('Failed to send OTP');
          res.send('Failed to send OTP. Please try again later.');
      }
  } catch (error) {
      // Log error if sending OTP fails
      console.error('Error in sending OTP:', error);
      res.send('Error occurred while sending OTP. Please try again.');
  }
});
router.post('/register/verify-otp', (req, res) => {
    const { phone, enteredOtp } = req.body;

    // Verify the OTP
    if (otpStore[phone] === enteredOtp) {
        delete otpStore[phone]; // Clear OTP after verification
        res.render('registerAs', { phone }); // Proceed to registration
    } else {
        res.send('Invalid OTP. Please try again!');
    }
});

router.get('/', (req, res) => {
    res.render('register'); // Ensure 'register.ejs' exists in your views folder
});

router.get('/login', (req, res) => {
    res.render('login'); // Ensure 'login.ejs' exists in your views folder
});

// Handle registration form submission
router.post('/', (req, res) => {
    // Implement registration logic here
    res.send('Registration logic to be implemented');
});

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/register/customer',async(req,res)=>{
  res.render('customerRegister');
})
// Customer Registration Form Submission
router.post('/register/customer', async (req, res) => {
    const { fullname, dob, phone, address, password } = req.body;

    const userId = uuidv4().slice(0, 7);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = new Customer({
            fullname,
            dob,
            phone,
            address,
            password: hashedPassword,
            userId,
        });

        await customer.save();
        res.render('registration-success', { userId: userId });
    } catch (err) {
        console.error('Error registering customer:', err);
        res.status(500).send('Error registering customer');
    }
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Route
router.post('/login', async (req, res) => {
    const { fullname, password } = req.body;

    try {
        const user = await Customer.findOne({ fullname });

        if (!user) {
            return res.status(400).send('Invalid name or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        req.session.user = {
            userId: user.userId,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            address:user.address
        };

        res.redirect('/'); // Redirect to home after successful login
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Server error');
    }
});




// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Render seller registration form
router.get('/register/seller', (req, res) => {
    res.render('sellerRegister');
});

// Handle seller registration form submission
router.post('/register/seller', upload.single('profilePicture'), async (req, res) => {
    const {
        shopName,
        ownerName,
        dob,
        pincode,
        location,
        description,
        operationalHours,
        kyc,
        password,
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = new Seller({
            shopName,
            ownerName,
            dob,
            pincode,
            location,
            description,
            operationalHours,
            kyc,
            password: hashedPassword, // Save hashed password
            profilePicture: req.file ? req.file.filename : null,
        });

        await seller.save();
        res.send('Seller registered successfully!');
    } catch (err) {
        console.error('Error registering seller:', err);
        res.status(500).send('Error registering seller');
    }
});
router.get('/login/seller',async(req,res)=>{
    res.render('loginSeller');
});

// POST /login/seller
router.post('/login/seller', async (req, res) => {
    const { shopName, password } = req.body;

    try {
        const seller = await Seller.findOne({ shopName });
        if (!seller) {
            return res.status(400).send('Invalid shop name or password');
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).send('Invalid shop name or password');
        }

        // Store shopName and other details in session
        req.session.user = {
            id: seller._id,
            role: 'seller',
            shopName: seller.shopName,  // Store shopName here
        };

        res.redirect('/seller-dashboard');
    } catch (err) {
        console.error('Error logging in seller:', err);
        res.status(500).send('Server error');
    }
});

// GET /seller-dashboard
router.get('/seller-dashboard', async (req, res) => {
    if (!req.session.user || !req.session.user.shopName) {
        return res.status(400).send('Seller not logged in or shop name missing');
    }

    try {
        // Find the seller by shopName stored in the session
        const seller = await Seller.findOne({ shopName: req.session.user.shopName });
        if (!seller) {
            return res.status(404).send('Seller not found');
        }

        // Render the seller dashboard with seller details
        res.render('sellerDashboard', {
            profilePicture: seller.profilePicture,
            shopName: seller.shopName,
            ownerName: seller.ownerName,
            location: seller.location,
        });
    } catch (err) {
        console.error('Error fetching seller details:', err);
        res.status(500).send('Error loading dashboard');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

module.exports = router;
