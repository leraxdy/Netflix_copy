const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MODEL
const UserSchema = new mongoose.Schema({

    username: String,

    email: String,

    password: String

});

const User = mongoose.model('users', UserSchema);

// REGISTER
app.post('/register', async (req, res) => {

    try {

        console.log(req.body);

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: 'User already exists'
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({

            username,
            email,
            password: hashedPassword

        });

        await newUser.save();

        console.log('USER SAVED');

        res.json({
            message: 'Registration successful'
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

// LOGIN
app.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: 'User not found'
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({
                message: 'Wrong password'
            });

        }

        res.json({
            message: 'Login successful'
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

// CONNECTION
const connection = async () => {

    try {

        console.log('connection init');

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Netflix_logins_DB'
        });

        console.log('connected');

        app.listen(5000, () => {

            console.log('Server started on port 5000');

        });

    } catch (err) {

        console.log(`err: ${err}`);

    }

};

connection();