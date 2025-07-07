const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        trim: true,
    },   
    type: {
        type: String,
        required: [true, 'Category type is required.'],
        enum: ['Exercise', 'Recipe', 'Resource'] 
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
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
}, {
    timestamps: true
});

/**
 * BEST PRACTICE: Create a compound index to ensure that the combination
 * of 'name' and 'type' is unique. This prevents you from having two 
 * "Legs" categories for 'Exercise' but allows a "Legs" category for 'Resource'.
 */
categorySchema.index({ name: 1, type: 1 }, { unique: true });


const Category = mongoose.model('Category', categorySchema);
module.exports = Category;