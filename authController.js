const client = require('../utils/twilio');

exports.sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }
    try {
        const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ to: `+91${phoneNumber}`, channel: 'sms' });
        res.render('verifyOtp', { message: 'OTP sent successfully', phoneNumber });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
        return res.status(400).json({ error: 'Phone number and code are required' });
    }
    try {
        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks
            .create({ to: `+91${phoneNumber}`, code });
        if (verificationCheck.status === 'approved') {
            res.render('registerOptions', { message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};
