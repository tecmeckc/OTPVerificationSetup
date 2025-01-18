const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const customerSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    dob: { type: Date },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true },
    userId: { type: String, default: () => uuidv4().slice(0, 7) }
});

module.exports = mongoose.model('Customer', customerSchema);
