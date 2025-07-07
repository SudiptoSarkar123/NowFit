const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Meal plan name is required.'],
        trim: true
    },
    
    createdByCoach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coach',
        required: true
    },

    dailyPlan: {
        breakfast: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
        lunch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
        dinner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
        snacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
    },
  
    totals: {
        totalCalories: { type: Number, default: 0 },
        totalProtein: { type: Number, default: 0 },
        totalCarbs: { type: Number, default: 0 },
        totalFats: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
module.exports = MealPlan;