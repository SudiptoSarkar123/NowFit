const mongoose = require('mongoose');

const assignedExerciseSchema = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    name: String,
    sets: String,
    reps: String,
    rest: String,
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

const workoutProgramSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    duration: String,
    schedule: [assignedWorkoutDaySchema], // The full program schedule
    createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'createdByModel', required: true },
    createdByModel: { type: String, enum: ['admin', 'coach'], required: true }
}, { timestamps: true });



module.exports = mongoose.model('WorkoutProgram', workoutProgramSchema);