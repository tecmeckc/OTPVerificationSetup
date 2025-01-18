const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Route handling for authentication
 // Adjust path if necessary
 const path = require('path');

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.json());
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static('public')); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ondcData')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.render('home', { user: req.session.user }); // Render the home page
});
app.use('/', authRoutes);
app.get('/about', (req, res) => {
    res.render('about'); // Render the about page
});

app.get('/settings', (req, res) => {
    res.render('settings'); // Render the settings page
});

// Authentication routes (register, login, OTP)

app.use('/register', authRoutes);
app.use('/login', authRoutes);
app.use('/auth', authRoutes);
app.use('/verify-otp', authRoutes);

app.post('/verify-otp', async (req, res) => {
    const { phoneNumber} = req.body;

    // Check if phoneNumber and code are provided
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number and code are required' });
    }

    try {
        // Verify the OTP using Twilio Verify API
        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks
            .create({ to: phoneNumber, code: code });

        // Check the verification status    
        if (verificationCheck.status === 'approved') {
            // OTP is correct; render the registration options page
            res.render('registerOptions', {
                message: 'OTP verified successfully',
                email: email, // Replace 'userEmail' with the actual variable holding the email
                phone: phoneNumber  // Ensure 'phone' is also defined and passed
            });
            
        } else {
            // OTP is incorrect; send an error response
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
