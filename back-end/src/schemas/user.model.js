// User.js
import mongoose from 'mongoose';
import restaurantSchema from "./Restaurant.js";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
    restaurants: [restaurantSchema],
});

const User = mongoose.model('User', userSchema);

export default User;
