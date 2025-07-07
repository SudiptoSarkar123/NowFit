const mongoose = require('mongoose');

/**
 * The Ingredient Schema.
 * This collection acts as the master food database.
 * Each document represents a raw food item with its nutritional profile per 100 grams.
 * e.g., "Chicken Breast (Raw)", "Olive Oil", "Banana"
 */
const ingredientSchema = new mongoose.Schema({
    /**
     * The name of the ingredient. Should be unique.
     * e.g., "Chicken Breast, boneless, skinless, raw"
     */
    name: {
        type: String,
        required: [true, 'Ingredient name is required.'],
        trim: true,
        unique: true
    },

    /**
     * A reference to a 'Recipe' type Category, e.g., "Protein", "Carbohydrate", "Fats".
     * This can help trainers find ingredients more easily.
     */
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    
    /**
     * The core nutritional data for this ingredient, standardized to a 100-gram serving.
     * This standardization makes all calculations consistent.
     */
    nutritionPer100g: {
        calories: { type: Number, required: true, default: 0 },
        protein: { type: Number, required: true, default: 0 },
        carbs: { type: Number, required: true, default: 0 },
        fats: { type: Number, required: true, default: 0 }
    }
}, {
    timestamps: true
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;