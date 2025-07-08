const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Corrected typo: bcrypt


const assignedMealSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    recipeName: String,
    calories: Number,
}, { _id: false });

const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'paused', 'inactive'], default: 'active' },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'coach', required: true },
    dateJoined: { type: Date, default: Date.now },

    assignedMealPlan: [
        {
            mealPlanId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MealPlan'
            },
        }
    ],
    assignedWorkoutProgram: [
        {
            programId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WorkoutProgram'
            }
        }
    ],


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