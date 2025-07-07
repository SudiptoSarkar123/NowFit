const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Corrected typo: bcrypt

// This schema remains the same
const assignedMealSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    recipeName: String,
    calories: Number,
}, { _id: false });

//======================== NEW SUB-SCHEMA ========================
// Sub-schema for a workout assigned to a client
const assignedExerciseSchema = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    name: String,
    sets: String,
    reps: String,
    rest: String,
    // Field for client to record their performance
    performanceLog: [{
        date: { type: Date, default: Date.now },
        weight: Number,
        repsCompleted: Number,
        notes: String
    }]
}, { _id: false });

const assignedWorkoutDaySchema = new mongoose.Schema({
    dayName: String,
    exercises: [assignedExerciseSchema]
}, { _id: false });
//================================================================


const clientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'paused', 'inactive'], default: 'active' },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'coach', required: true },
    dateJoined: { type: Date, default: Date.now },

    assignedMealPlan: {
        planAssignedDate: Date,
        dailyPlan: {
            breakfast: [assignedMealSchema],
            lunch: [assignedMealSchema],
            dinner: [assignedMealSchema],
            snacks: [assignedMealSchema]
        },
        dailyTotals: {
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number
        }
    },

   
    assignedWorkoutProgram: {
        programId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutProgram' },
        programName: String,
        startDate: Date,
        // The full schedule copied from the template
        schedule: [assignedWorkoutDaySchema]
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