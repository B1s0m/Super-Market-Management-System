const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
   category: {
    type: String,
    required: true,
    enum: [
      "Fruits",
      "Vegetables",
      "Dairy",
      "Bakery",
      "Beverages",
      "Snacks",
      "Frozen Foods",
      "Other"
    ]
  },

/////////////
category: {
  type: String,
  required: true,
  enum: [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Beverages",
    "Snacks",
    "Frozen Foods",

    "Electronics",
    "Mobile Phones",
    "Laptops",
    "Computers",
    "Tablets",
    "TV & Audio",
    "Gaming",
    "Cameras",
    "Smart Watches",
    "Accessories",

    "Home Appliances",

    "Clothing",
    "Books",
    "Toys",

    "Other"
  ]
}
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
  required: true,
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

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;