const mongoose = require('mongoose')

const dailyHabitsSchema = new mongoose.Schema({
    title: { type: String, },
    description: { type: String, },
    isCompleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'coach' },
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model('dailyHabits', dailyHabitsSchema)