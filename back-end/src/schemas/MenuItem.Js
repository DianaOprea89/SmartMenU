// MenuItem.js
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuCategory', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    image: String // This should be a URL to the image
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
