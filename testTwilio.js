


process.chdir(require('path').resolve(__dirname, '../'));
require('dotenv').config();
const twilio = require('twilio');


console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendTestOtp = async (to, otp) => {
  try {
      const message = await client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER, // Ensure this is your Twilio number
          to: to,
          body: `Your OTP is ${otp}`,
      });

      console.log('Message sent:', message.sid);
      return true;
  } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
  }
};

sendTestOtp('+91XXXXXXXXXX', '123456'); // Replace with a real recipient number.
