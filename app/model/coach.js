const mongoose = require('mongoose');
const brcypt = require('bcryptjs');

const coachSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending'
    },

    coachType: {
        type: String,
        enum: ['Personal Coach', 'Gym Manager','Nutritionist' ,'Other'],
        // required: true
        default: 'Personal Coach'
    },

    workplace: {
        type: String,
        enum: ['Gym','Online Only', 'Home-based', 'Corporate Training', 'Other'],
        // required: true
    },

    profile: {
        specialty: { type: String },
        bio: { type: String },
        image: { type: String },
        clientCount: { type: Number },
    },

    socialMedia: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
    },

    contactInfo: {
        phone: { type: String },
        email: { type: String },
        address: { type: String },
    },
    firstLogin: { type: Boolean, default: true },
    dateJoined: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
});


coachSchema.pre("save",async function (next){
    if(this.isModified('password')){
        this.password = await brcypt.hash(this.password,10)
    }
    next()
})

module.exports = mongoose.model('coach', coachSchema);