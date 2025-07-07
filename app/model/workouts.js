const mongoose = require('mongoose');

const WorkoutSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
   
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    mediaFile: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'createdByModel',
        // required: true 
    },
    createdByModel:{
        type:String,
        // required:true,
        enum:['admin','coach']
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('workout', WorkoutSchema);