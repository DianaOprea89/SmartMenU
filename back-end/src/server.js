
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
    try {
        const { name, email, password, passwordConfirm } = req.body;

        if (!name || !email || !password || !passwordConfirm) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Simple regex for basic email validation
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
            username: name, // Ensure this matches your schema
            email,
            passwordHash: hashedPassword
        });

        await user.save();


        res.status(201).json({
            message: 'User registered successfully',
            user: { username: user.username, email } // Don't send back the password or hashed password
        });
    } catch (error) {
        console.error('Registration error:', error);
        // Send a generic error message to the client
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


app.put('/api/editOptionMenuRestaurants/:userId/:restaurantName', async (req, res) => {
    try {
        const { userId, restaurantName } = req.params;
        const { newPhotoLink, newOptionName } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const restaurant = user.restaurants.find(
            (restaurant) => restaurant.name === restaurantName
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Find the menu option in the restaurant's menuOptions array
        const menuOption = restaurant.menuOptions.find(
            (option) => option.photoLink === newPhotoLink
        );

        if (!menuOption) {
            return res.status(404).json({ message: 'Menu option not found' });
        }

        // Update the menu option's name
        menuOption.optionName = newOptionName;

        await user.save();

        res.status(200).json({
            message: 'Menu option updated successfully',
            updatedOption: menuOption,
        });
    } catch (error) {
        console.error('Error editing menu option:', error);
        res.status(500).json({ message: 'Error editing menu option' });
    }
});




app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
