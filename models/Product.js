const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  description: {
    type: String,
    trim: true
  },

  image: {
    type: String,
    default: ""
  },
  brand: {
  type: String,
  default:"unknow",
  trim: true
},
discount: {
  type: Number,
  default: 0,
  min: 0,
  max: 100
},
views: {
  type: Number,
  default: 0
},

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }


  , specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

    subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true
  },



}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;