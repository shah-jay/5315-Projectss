/******************************************************************************ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber AcademicPolicy.
 * No part of this assignment has been copied manually or electronically from any othersource(including web sites)
 *  or distributed to other students
 * Name:Jay shah Student ID:N01545323 Date:07-04-2024******************************************************************************/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for restaurant collection
const RestSchema = new Schema({
    name: { type: String, required: true },
    borough: { type: String, default: '' }, 
    cuisine: { type: String, required: true },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' }
    },
    grades: [
        {
            grade: { type: String, default: '' },
            score: { type: Number, default: 0 }
        }
    ],
    restaurant_id: {type: String,default: ''}
});

// Create a model based on the schema
const Restaurant = mongoose.model("Restaurant", RestSchema);

// Export the model
module.exports = Restaurant;