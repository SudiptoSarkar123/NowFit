const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required: [true, 'Recipe name is required.'],
        trim: true
    },
    
   
   
    instructions: {
        type: String,
        required: [true, 'Preparation instructions are required.']
    },

   
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // A general User model that points to an Admin or a Coach
        // required: true
    },


    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    ingredients: [{
        name: { type:String, required: true },
        amount: { type: Number, required: true }
    }],


    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        // required:true,
        refPath:'createdByModel'
    },
    createdByModel:{
        type:String,
        required:true,
        enum:['admin','coach']
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    totalCalories: {
        type: Number,
        default: 0
    }
},{
    timestamps:true
});



module.exports = mongoose.model('Recipe',recipeSchema);
    
   


const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
