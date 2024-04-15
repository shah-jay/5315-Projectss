/******************************************************************************ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber AcademicPolicy.
 * No part of this assignment has been copied manually or electronically from any othersource(including web sites)
 *  or distributed to other students
 * Name:Jay shah Student ID:N01545323 Date:07-04-2024******************************************************************************/

const Restaurant = require('./model/restaurent');
const mongoose = require("mongoose");
const connectionString = process.env.DB_CONNECTION_STRING;
async function initialize() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Create a new restaurant
const addNewRestaurant = async (data) => {
    try {
      const newRestaurant = await Restaurant.create(data);
      return newRestaurant;
    } catch (error) {
      console.error('Error adding new restaurant:', error);
      throw error;
    }
  };

  // Get all restaurants with pagination and optional filtering by borough
const getAllRestaurants = async (page, perPage, borough) => {
    try {
      const skip = (page - 1) * perPage;
      let query={};
      if (borough) {
        console.log('borough',borough)
        query.borough=borough;

      }
      const restaurants = Restaurant.find(query).skip(skip).limit(perPage).sort({ restaurant_id: 1 });
      return restaurants;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  };

  // Get a restaurant by ID
const getRestaurantById = async (id) => {
    try {
      const restaurant = await Restaurant.findById(id);
      return restaurant;
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      throw error;
    }
  };
  
  // Update a restaurant by ID
  const updateRestaurantById = async (data, id) => {
    try {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate({_id:id}, data, { new: true });
      return updatedRestaurant;
    } catch (error) {
      console.error('Error updating restaurant by ID:', error);
      throw error;
    }
  };
  
  // Delete a restaurant by ID
  const deleteRestaurantById = async (id) => {
    try {
      const deletedRestaurant = await Restaurant.findByIdAndDelete({_id:id});
      return deletedRestaurant;
    } catch (error) {
      console.error('Error deleting restaurant by ID:', error);
      throw error;
    }
  };

module.exports = {
  initialize,
  addNewRestaurant,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};
