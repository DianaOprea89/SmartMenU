
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './schemas/CombinedSchema.js';
import 'express-async-errors';



import apiOut from './apiOut.js';

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


app.get('/api/restaurant/:name', async (req, res) => {
    try {
        const { name } = req.params;
        // Assuming the restaurant name is unique. Adjust the query as needed.
        const restaurant = await User.findOne({ "restaurants.name": name }, { "restaurants.$": 1 });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Send the first restaurant in the array, as the query returns an array
        res.status(200).json(restaurant.restaurants[0]);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/userData', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded);


        const user = await User.findById(decoded.userId).populate('restaurants');

        console.log('User data from database:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.username,
            email: user.email,
            id: user._id,
            restaurants: user.restaurants, // Make sure to include populated restaurants here
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Invalid token' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


app.put('/api/editRestaurant/:userId/:restaurantId', async (req, res) => {
    try {
        const { userId, restaurantId } = req.params;
        const updatedData = req.body; // Updated restaurant data from the request body

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the restaurant in the user's restaurants array by restaurantId
        const restaurant = user.restaurants.find((r) => r._id.toString() === restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Update the restaurant's data with the new details
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
    console.log('DELETE request to /api/removeRestaurant');
    const { userId, restaurantId } = req.params;
    console.log('Received userId:', userId);
    console.log('Received restaurantId:', restaurantId);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const updatedRestaurants = user.restaurants.filter(restaurant => restaurant._id.toString() !== restaurantId);


        user.restaurants = updatedRestaurants;

        await user.save();

        console.log(`Removed restaurant with id ${restaurantId} from the user's restaurants`);

        res.status(200).json({ message: 'Restaurant removed successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ message: 'Error deleting restaurant' });
    }
});





app.post('/api/register', async (req, res) => {

    let apiOutObj = new apiOut(res);


    // -----------------------------
    // 1. input checks
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
        apiOutObj.addError('name', 'Name is required');
    }

    if (password !== passwordConfirm) {
        apiOutObj.addError('password', 'Passwords do not match');
    }

    // Simple regex for basic email validation
    const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        apiOutObj.addError('email', 'Invalid email format');
        //return res.status(400).json({ message: 'Invalid email format' });
    }

    // guard for input checks
    if (apiOutObj.hasErrors()) {
        apiOutObj.sendReply();
        return;
    }

    // -----------------------------
    // 2. db checks
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            apiOutObj.addError('email', 'Email already in use');
        }
    } catch (error) {
        apiOutObj.addError('db', error.message);
        return;
    }

    // guard for db checks
    if (apiOutObj.hasErrors()) {
        apiOutObj.sendReply();
        return;
    }


    // -----------------------------
    // 3. logic

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: name, // Ensure this matches your schema
            email,
            passwordHash: hashedPassword
        });
        await user.save();
    } catch (error) {
        apiOutObj.addError('db', error.message);
        return;
    }



    apiOutObj.sendReply();

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



app.get('/api/getRestaurants', async (req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null; // Authorization: 'Bearer TOKEN'

    console.log('Received token:', token); // Log the received token

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded); // Log the decoded token

        // Use the user ID in the decoded token to look up the user in the database
        const user = await User.findById(decoded.userId).populate('restaurants');

        console.log('User data from database:', user);
        console.log('Decoded token:', decoded);


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



app.post('/api/addRestaurants', async (req, res) => {
    try {
        const { userId, name, address , phoneNumber, aboutUs ,logoImage, newItem } = req.body;

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

            menuOptions: [newItem],
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


// PUT endpoint to update a sub-menu option
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


// DELETE endpoint to remove a sub-menu option
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




app.put('/api/editRestaurant/:userId/:restaurantId', async (req, res) => {
    try {
        const { userId, restaurantId } = req.params;
        const { name, aboutUs, address, phoneNumber } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the restaurant by restaurantId within the user's restaurants array
        const restaurantIndex = user.restaurants.findIndex(
            (restaurant) => restaurant._id.toString() === restaurantId
        );

        if (restaurantIndex === -1) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Update the restaurant details
        const restaurant = user.restaurants[restaurantIndex];
        restaurant.name = name || restaurant.name;
        restaurant.aboutUs = aboutUs || restaurant.aboutUs;
        restaurant.address = address || restaurant.address;
        restaurant.phoneNumber = phoneNumber || restaurant.phoneNumber;

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

const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
