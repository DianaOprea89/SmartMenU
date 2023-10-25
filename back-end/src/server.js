import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'mongodb';
const { MongoClient } = pkg;
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const corsOptions = {
    origin: 'http://localhost:8082',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
let db;


const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
console.log(`Connecting to: ${connectionString}`);
MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('SmartMenu');
        console.log('Connected to MongoDB');


        const usersCollection = db.collection('users');


    })
    .catch(error => {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    });

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

app.post('/api/register', async (req, res) => {
    try {
        const { id, name, email, password, passwordConfirm } = req.body;

        if (!name || !email || !password || !passwordConfirm) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }


        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id,
            name,
            email,
            password: hashedPassword,
            cartItems: []
        };

        await db.collection('users').insertOne(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: { name, email }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }

});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request with email:', email);

    const user = await db.collection('users').findOne({ email });
    console.log('Found user:', user);

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({
        message: 'Login successful',
        user: {
            name: user.name,
            email: user.email,
            id: user.id
        },

    });
});



app.listen(8008, () => {
    console.log('Server is listening on port 8008');
});