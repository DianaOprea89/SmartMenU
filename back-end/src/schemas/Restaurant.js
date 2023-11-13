// Restaurant.js
import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    phoneNumber: String,
    aboutUs: String,
    logoImage: String // This should be a URL to the image
});



export default restaurantSchema;
