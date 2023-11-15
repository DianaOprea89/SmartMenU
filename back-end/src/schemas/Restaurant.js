// Restaurant.js
import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    phoneNumber: String,
    aboutUs: String,
    logoImage: String,
    menuOptions: [{ photoLink: String, optionName: String }], // Add menuOptions field
});

export default mongoose.model('Restaurant', restaurantSchema);

