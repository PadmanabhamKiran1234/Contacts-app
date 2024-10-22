const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    companyName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber1: {
        type: String,
        required: true
    },
    phoneNumber2: {
        type: String,
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        country: {
            type: String,
            required: true
        }
    },
    image: {
        type: String 
    }
});

module.exports = mongoose.model('Contact', ContactSchema);
