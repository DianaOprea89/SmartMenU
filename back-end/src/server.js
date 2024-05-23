import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './schemas/CombinedSchema.js';
import 'express-async-errors';

dotenv.config();
const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

console.log("Connecting to MongoDB at:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB...');
}).catch(err => {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1); // Exit with a failure code
});

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`);
    next();
});

// Error handling middleware to catch any errors
app.use((err, req, res, next) => {
    console.error(`Error processing request ${req.method} ${req.url} - `, err);
    res.status(500).send('Internal Server Error');
});

app.get('/api/restaurant/:name', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const { name } = req.params;
        const restaurant = await User.findOne({ "restaurants.name": name }, { "restaurants.$": 1 });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant.restaurants[0]);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware to handle authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// Route to retrieve user data
app.get('/api/userData', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('restaurants');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            name: user.username,
            email: user.email,
            id: user._id,
            restaurants: user.restaurants,
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/editRestaurant/:userId/:restaurantId', async (req, res) => {
    try {
        const { userId, restaurantId } = req.params;
        const updatedData = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.find(r => r._id.toString() === restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        Object.assign(restaurant, updatedData);
        await user.save();
        res.status(200).json({
            message: 'Restaurant updated successfully',
            updatedRestaurant: restaurant,
        });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ message: 'Error updating restaurant' });
    }
});

app.delete('/api/removeRestaurant/:userId/:restaurantId', async (req, res) => {
    try {
        const { userId, restaurantId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.restaurants = user.restaurants.filter(r => r._id.toString() !== restaurantId);
        await user.save();
        res.status(200).json({ message: 'Restaurant removed successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ message: 'Error deleting restaurant' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, passwordConfirm } = req.body;
        if (!name || !email || !password || !passwordConfirm) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: name,
            email,
            passwordHash: hashedPassword
        });
        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: { username: user.username, email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                name: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

app.get('/api/getRestaurants', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('restaurants');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.restaurants);
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Invalid token' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
//Post endpoint to add a restaurant//
app.post('/api/addRestaurants', async (req, res) => {
    // Corrected log statement to display the incoming request body
    console.log('Received request with data:', req.body);

    try {
        const { userId, name, address, phoneNumber, aboutUs, logoImage, newItem } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingRestaurant = user.restaurants.find((restaurant) => restaurant.name === name);
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Restaurant with this name already exists' });
        }

        const newRestaurant = {
            name,
            address,
            phoneNumber,
            logoImage,
            aboutUs,
            menuOptions: newItem ? [newItem] : [], // Adjust based on whether newItem is provided
        };

        user.restaurants.push(newRestaurant);
        await user.save();

        res.status(201).json({
            message: 'Restaurant created and associated with the user',
            restaurant: newRestaurant,
        });
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ message: 'Error creating restaurant' });
    }
});

//Post endpoint to add an Option Menu//
app.post('/api/addOptionMenuRestaurants', async (req, res) => {
    try {
        const { userId, name, newItem } = req.body;
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const existingRestaurant = user.restaurants.find((restaurant) => restaurant.name === name);
        if (!existingRestaurant) {
            return res.status(400).json({ message: 'Restaurant not found' });
        }
        // Add the new menu option to the restaurant's menuOptions array
        existingRestaurant.menuOptions.push(newItem);
        await user.save();
        res.status(201).json({
            message: 'Menu option added to the restaurant',
            newItem: newItem,
        });
    } catch (error) {
        console.error('Error adding menu option:', error);
        res.status(500).json({ message: 'Error adding menu option' });
    }
});
//Post endpoint to add a subOption //
app.post('/api/addSubOptionMenuRestaurants', async (req, res) => {
    try {
        const { userId, name, menuOptionName, newSubMenuItem } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.find(r => r.name === name);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const menuOption = restaurant.menuOptions.find(option => option.optionName === menuOptionName);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        menuOption.subMenuOptions.push(newSubMenuItem);
        await user.save();
        res.status(201).json({ message: 'Sub-menu item added successfully', newSubMenuItem });
    } catch (error) {
        console.error('Error adding sub-menu item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Put endpont to edit a mealOption//
app.put('/api/editMealOption/:userId/:restaurantId/:menuOptionId/:subMenuOptionId/:mealOptionId', async (req, res) => {
    try {
        const { userId, restaurantId, menuOptionId, subMenuOptionId, mealOptionId } = req.params;
        const { photoLink,optionName,quantity,ingredients,price,description,unit } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        const subMenuOption = menuOption.subMenuOptions.id(subMenuOptionId);
        if (!subMenuOption) {
            return res.status(404).json({ message: 'Sub-menu option not found' });
        }
        const mealOption = subMenuOption.mealOptions.id(mealOptionId);
        if(!mealOptions) {
            return res.status(404).json({ message: 'Meal  option not found' });
        }
        // Update the Meal option
        mealOption.photoLink = photoLink || mealOption.photoLink;
        mealOption.optionName = optionName || mealOption.optionName;
        mealOption.quantity = quantity || mealOption.quantity;
        mealOption.ingredients = ingredients || mealOption.ingredients;
        mealOption.price = price || mealOption.price;
        mealOption.description = description || mealOption.description;
        mealOption.unit = unit || mealOption.unit;
        await user.save();
        res.status(200).json({
            message: 'Meal option updated successfully',
            updatedSubMenuOption: subMenuOption
        });
    } catch (error) {
        console.error('Error updating sub-menu option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// delete endpoint for already dispalyed meal option//
app.delete('/api/removeMealOption/:userId/:restaurantId/:menuOptionId/:subMenuOptionId/:mealOptionId', async (req, res) => {
    console.log("DELETE request received with params:", req.params);
    try {
        const { userId, restaurantId, menuOptionId, subMenuOptionId, mealOptionId } = req.params;
        console.log("Received parameters for deletion:", req.params);
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        const subMenuOption = menuOption.subMenuOptions.id(subMenuOptionId);
        if (!subMenuOption) {
            return res.status(404).json({ message: 'Sub-menu option not found' });
        }
        // Check if the meal option exists
        const mealOptionExists = subMenuOption.mealOptions.some(mo => mo._id.toString() === mealOptionId);
        if (!mealOptionExists) {
            return res.status(404).json({ message: 'Meal option not found' });
        }
        // Remove the meal option using pull
        subMenuOption.mealOptions.pull(mealOptionId);
        await user.save();
        res.status(200).json({ message: 'Meal option removed successfully' });
    } catch (error) {
        console.error('Error in deleteMealOption:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//edit enpoint for already displayed mealOption//
app.put('/api/updateMealOption/:userId/:restaurantId/:menuOptionId/:subMenuOptionId/:mealOptionId', async (req, res) => {
    try {
        const { userId, restaurantId, menuOptionId, subMenuOptionId, mealOptionId } = req.params;
        const { photoLink, optionName, quantity, ingredients, price, description, unit } = req.body;
        // Log the IDs received in the request
        console.log('IDs received:', { userId, restaurantId, menuOptionId, subMenuOptionId, mealOptionId });
        // Find the user and check if exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Log the query parameters for debugging
        console.log('Querying for restaurant:', restaurantId);
        const restaurant = user.restaurants.id(restaurantId);
        // More logging
        console.log('Restaurant found:', restaurant);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // Log for debugging menuOption and subMenuOption
        console.log('Querying for menuOption:', menuOptionId);
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        console.log('menuOption found:', menuOption);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        console.log('Querying for subMenuOption:', subMenuOptionId);
        const subMenuOption = menuOption.subMenuOptions.id(subMenuOptionId);
        console.log('subMenuOption found:', subMenuOption);
        if (!subMenuOption) {
            return res.status(404).json({ message: 'Sub-menu option not found' });
        }
        const mealOption = subMenuOption.mealOptions.id(mealOptionId);
        if (!mealOption) {
            return res.status(404).json({ message: 'Meal option not found' });
        }
        // Correctly access properties from req.body
        mealOption.photoLink = photoLink || mealOption.photoLink;
        mealOption.optionName = optionName || mealOption.optionName;
        mealOption.quantity = quantity || mealOption.quantity;
        mealOption.ingredients = ingredients || mealOption.ingredients;
        mealOption.price = price || mealOption.price;
        mealOption.description = description || mealOption.description;
        mealOption.unit = unit || mealOption.unit;
        await user.save();
        res.status(200).json({
            message: 'Meal option updated successfully',
            updatedMealOption: mealOption
        });
    } catch (error) {
        console.error('Error updating meal option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// PUT endpoint to edit a sub-menu option//
app.put('/api/editSubMenuOption/:userId/:restaurantId/:menuOptionId/:subMenuOptionId', async (req, res) => {
    try {
        const { userId, restaurantId, menuOptionId, subMenuOptionId } = req.params;
        const { photoLink, subMenuOptionName } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        const subMenuOption = menuOption.subMenuOptions.id(subMenuOptionId);


        if (!subMenuOption) {
            return res.status(404).json({ message: 'Sub-menu option not found' });
        }
        // Update the sub-menu option
        subMenuOption.photoLink = photoLink || subMenuOption.photoLink;
        subMenuOption.subMenuOptionName = subMenuOptionName || subMenuOption.subMenuOptionName;
        await user.save();
        res.status(200).json({
            message: 'Sub-menu option updated successfully',
            updatedSubMenuOption: subMenuOption
        });
    } catch (error) {
        console.error('Error updating sub-menu option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Delete endpoint to remove a sub-menu option//
app.delete('/api/removeSubMenuOption/:userId/:restaurantId/:menuOptionId/:subMenuOptionId', async (req, res) => {
    try {
        const { userId, restaurantId, menuOptionId, subMenuOptionId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        // Remove the sub-menu option
        menuOption.subMenuOptions.pull(subMenuOptionId);
        await user.save();
        res.status(200).json({ message: 'Sub-menu option removed successfully' });
    } catch (error) {
        console.error('Error removing sub-menu option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// POST endpoint to add a new meal option under a specific subMenuOption
app.post('/api/addMealOption/:userId/:restaurantId/:menuOptionId/:subMenuOptionId', async (req, res) => {
    try {
        const { userId, restaurantId, menuOptionId, subMenuOptionId } = req.params;
        const newMealOption = req.body; // The new meal option data
        // Validate the meal option data as necessary
        // ...
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        const subMenuOption = menuOption.subMenuOptions.id(subMenuOptionId);
        if (!subMenuOption) {
            return res.status(404).json({ message: 'Sub-menu option not found' });
        }
        // Add the new meal option to the subMenuOption's mealOptions array
        subMenuOption.mealOptions.push(newMealOption);
        await user.save();
        res.status(201).json({
            message: 'New meal option added successfully',
            newMealOption
        });
    } catch (error) {
        console.error('Error adding new meal option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Put Endpoint to the edit a  restaurant//

//Delete endpoint to the OptionMenu //
app.delete('/api/removeOptionMenuRestaurants/:userId/:restaurantId/:menuOptionId', async (req, res) => {
    const { userId, restaurantId, menuOptionId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        console.log("Current Menu Options:", restaurant.menuOptions);
        // Ensuring all menu options are valid objects and filtering out the one to remove
        restaurant.menuOptions = restaurant.menuOptions.filter(option => option && option._id.toString() !== menuOptionId);
        await user.save();
        console.log("Updated Menu Options:", restaurant.menuOptions);
        res.status(200).json({ message: 'Menu option removed successfully' });
    } catch (error) {
        console.error('Error removing menu option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Put endpoint to edit an option added to a restaurant //
app.put('/api/editOptionMenuRestaurants/:userId/:restaurantId/:menuOptionId', async (req, res) => {
    try {
        const { userId, restaurantId, menuOptionId } = req.params;
        const { photoLink, optionName } = req.body; // Assuming these are the fields you want to update
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Find the restaurant by restaurantId
        const restaurant = user.restaurants.id(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // Find the menu option by menuOptionId
        const menuOption = restaurant.menuOptions.id(menuOptionId);
        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }
        // Update the menu option
        if (photoLink) menuOption.photoLink = photoLink;
        if (optionName) menuOption.optionName = optionName;
        await user.save();
        res.status(200).json({
            message: 'Menu option updated successfully',
            updatedOption: menuOption
        });
    } catch (error) {
        console.error('Error updating menu option:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8013;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});