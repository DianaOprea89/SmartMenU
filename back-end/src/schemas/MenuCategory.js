// MenuCategory.js
import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: String,
    image: String // This should be a URL to the image
});

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);

export default MenuCategory;

