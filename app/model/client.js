const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Corrected typo: bcrypt



const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'paused', 'inactive'], default: 'active' },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'coach', required: true },
    dateJoined: { type: Date, default: Date.now },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: { type: Number },
    weight: { type: Number },
    age: { type: Number },
    address: { type: String },
    city: { type: String },
    avatarUrl: { type: String },
    phoneNumber: { type: String },

   assignedMealPlan: {
        mealPlanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MealPlan'
        }
    },
  assignedWorkoutProgram: [{
        programId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WorkoutProgram'
        }
    }],
    dailyHabits: {
        habitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DailyHabits'
        }
    },


}, {
    timestamps: true
});


clientSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Corrected typo: bcrypt
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('client', clientSchema);