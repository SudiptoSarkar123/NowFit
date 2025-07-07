// Transaction Schema (transactionModel.js)
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { 
        type: String,
        required: true,
        unique: true
    },
    client: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    coach: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coach',
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'package'
    },
    packageName: String, // Stored for easy display, in case the original package is deleted
    amount: { 
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'INR' 
    },
    platformFee: {
        type: Number,
        required: true
    },
    coachPayout: { // The net amount the coach receives (amount - platformFee)
        type: Number,
        required: true
    },
    paymentGateway: { 
        type: String,
        required: true
    },
    status: { // The status from the payment gateway
        type: String,
        enum: ['succeeded', 'pending', 'failed', 'refunded'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);