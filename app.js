/******************************************************************************ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber AcademicPolicy.
 * No part of this assignment has been copied manually or electronically from any othersource(including web sites)
 *  or distributed to other students
 * Name:Jay shah Student ID:N01545323 Date:07-04-2024******************************************************************************/
require("dotenv").config({ path: '.env' });
const express = require("express");
const mongoose = require("mongoose");
const db = require('./db.js');
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { engine } = require('express-handlebars');
const database = require("./config/database");
const handlebars = require("handlebars");
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Restaurant = require("./model/restaurent.js");
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(express.static('public'));
app.use(cookieParser());
db.initialize()
    .then(() => {
        console.log('MongoDB initialized successfully');
    })
    .catch((error) => {
        console.error('Error initializing MongoDB:', error);
    });
// View engine setup
const zeroToText = (value) => {
    return value === 0 ? 'zero' : value;
};
// view engine setup
app.engine('hbs', engine({
    extname: '.hbs',
    helpers: {
        zeroToText: zeroToText, // Register custom helper
        eq: function (arg1, arg2) { return arg1 === arg2; } // Register eq helper
    },
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', '.hbs');

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers ["authorization"];
    console.log('bearerHeader==> ',bearerHeader)
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.SECRETKEY, (err, decoded) => {
            if (err) {
                // Token verification failed
                return res.sendStatus(401); // Unauthorized
            }
            // Token verification successful
            console.log(decoded);
            next(); // Continue to the next middleware or route handler
        });
    } else {
        // No token provided in the request
        return res.sendStatus(401); // Unauthorized
    }
}

// Login route to authenticate users and generate JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Authenticate user (e.g., check username/password in DB)
    if (username === 'admin' && password === 'admin123') { // Example credentials, replace with actual logic
        const token = jwt.sign({ username: username }, process.env.SECRETKEY);
        res.cookie('token', token, { httpOnly: true }); // Store JWT in a secure cookie
        res.json({ message: 'Login successful',Token:token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


// Route to render form or form with results
app.get('/api/restaurants', (req, res) => {
    res.render('form', { title: 'Restaurant Form' });
});

app.post('/api/restaurants', async (req, res) => {
    const { page, perPage, borough } = req.body;
    try {
        const restaurants = await db.getAllRestaurants(page, perPage, borough);
        res.render('restaurent',
            {
                title: 'Restaurant Data',
                data: restaurants,
            });
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update an existing restaurant (protected route)
app.put('/api/restaurants/:id', verifyToken, async (req, res) => {
    console.log('req--> ',req);
    const restaurantId = req.params.id;
    const updateData = req.body; // Assuming req.body contains the updated restaurant data
console.log("Jay shah",restaurantId)
    try {

        // // Check if the user has permission to update this restaurant (you can implement your own logic here)
        // if (req.username !== 'admin') {
        //     return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        // }

        // Update the restaurant in the database
        const updatedRestaurant = await db.updateRestaurantById(updateData,restaurantId,{ new: true });

        // if (!updatedRestaurant) {
        //     return res.status(404).json({ message: 'Restaurant not found' });
        // }

        res.json(updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to delete a restaurant (protected route)
app.delete('/api/restaurants/:id', verifyToken, async (req, res) => {
    const restaurantId = req.params.id;
    try {
        // Check if the user has permission to delete this restaurant (you can implement your own logic here)
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        // }
        // Delete the restaurant from the database
        const deletedRestaurant = await db.deleteRestaurantById(restaurantId);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Paths to perform operations on web browser as an application(delet and update)
app.get('/api/restaurants/:id', async (req, res) => {
    console.log(req.params)
    // const restaurantId = mongoose.Types.ObjectId(req.params.id.toString());
    console.log(restaurantId);
    try {
        // Fetch the restaurant using the getRestaurantById function from db.js
        const restaurant = await db.getRestaurantById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
