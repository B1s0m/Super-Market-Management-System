const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
},
   numbrer: {
    type: Number,
  },
  

  wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }
],

  role: {
    type: String,
enum: [
    "customer",
    "employee",
    "delivery",
    "admin"
  ],    default: "customer"
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;