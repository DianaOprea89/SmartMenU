import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
    restaurants: [
        {
            name: { type: String, required: true },
            address: String,
            phoneNumber: String,
            aboutUs: String,
            logoImage: String,
            menuOptions: [
                {
                    photoLink: String,
                    optionName: String
                }
            ],
        },
    ],
});

export default mongoose.model('User', userSchema);


