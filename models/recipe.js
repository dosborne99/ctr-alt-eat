const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RecipeSchema = mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true, trim: true},
    description: String,
    type: {type: String, trim: true},
    servings: Number,
    ingredients: [String],
    directions: [String]
});

const Recipe = mongoose.model('Recipe', RecipeSchema, 'recipes');
module.exports = Recipe;