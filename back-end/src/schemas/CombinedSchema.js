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
                    optionName: String,
                    subMenuOptions: [
                        {
                            photoLink: String,
                            subMenuOptionName: String,
                            mealOptions:[
                                {
                                    photoLink: String,
                                    optionName: String,
                                    quantity: String,
                                    ingredients: String,
                                    price: String,
                                    description: String,
                                    unit: String,
                                    categoryMenuOption: String
                                }
                            ]
                        },
                    ],
                },
            ],

        },
    ],
});

export default mongoose.model('User', userSchema);


