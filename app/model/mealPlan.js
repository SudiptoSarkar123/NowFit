const mongoose = require('mongoose');
const Recipe = require('./recipe');
const mealPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Meal plan name is required.'],
        trim: true
    },
    createdBy: {
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
}, { timestamps: true });


mealPlanSchema.pre('save', async function (next) {
    console.log('Pre-save hook triggered');

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    const allRecipeIds = [
        ...this.dailyPlan.breakfast,
        ...this.dailyPlan.lunch,
        ...this.dailyPlan.dinner,
        ...this.dailyPlan.snacks
    ];

    console.log('Recipe IDs to fetch:', allRecipeIds);

    const recipes = await Recipe.find({ _id: { $in: allRecipeIds } });

    console.log('Fetched recipes:', recipes);

    recipes.forEach(recipe => {
        totalCalories += recipe.nutrition.calories || 0;
        totalProtein += recipe.nutrition.protein || 0;
        totalCarbs += recipe.nutrition.carbs || 0;
        totalFats += recipe.nutrition.fats || 0;
    });

    this.totals = {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats
    };

    console.log('Final totals:', this.totals);

    next();
});


const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
module.exports = MealPlan;
