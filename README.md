# OTPVerificationSetup
# About
A mini project built with Node.js, Express, MongoDB, and EJS, designed to integrate third-party services for OTP-based registration and profile management for buyers and sellers. The project mimics real-world requirements, providing a user-friendly platform to set up and manage buyer and seller profiles.
# Features
->OTP Integration: Send and verify OTPs during registration using Twilio.

->Buyer and Seller Registration: Separate workflows for buyers and sellers, including role-based authentication.

->Secure Password Storage: Passwords are hashed using bcrypt for secure authentication.

->Buyer Profile: Set up profiles with personal details.

->Seller Profile: Manage seller details, including shop name, owner name, location, and profile picture.

->Seller Dashboard: A dedicated dashboard for sellers to view their profile.

# Technologies Used
-->Backend:

Node.js
Express.js

-->Frontend:

EJS (Embedded JavaScript) for templating

-->Database:
MongoDB

-->Authentication:

Bcryptjs (for password hashing)

Express-session (for session management)

-->Third-Party Services:

Twilio (for OTP sending and verification)

-->File Uploads:

Multer (for handling file uploads, such as profile pictures)


