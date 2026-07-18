const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
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
// This for how mach this prodect view
views: {
  type: Number,
  default: 0
},

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
     
  //Tell the customer about the product
  description: {
    type: String,
    trim: true
  },
    // What is the product made of or what are its technical details
   specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // What choices can the customer select before buying
  variants: [
  {
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: Number,
      default: 0
    },

    image: {
      type: String,
      default: ""
    }
  }
],

    subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true
  },



}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

//  Example how  the prodect show   
// {
//  name: "Nike Air Max",

//  description:
//  "Comfortable running shoes designed for everyday use and sports.",

//  specifications: {
//     material: "Leather",
//     sole: "Rubber",
//     type: "Running shoes"
//  },

//  variants: [
//     {
//       attributes:{
//         color:"Black",
//         size:"42"
//       },
//       price:120,
//       quantity:5,
//       image:"black42.jpg"
//     },

//     {
//       attributes:{
//         color:"White",
//         size:"43"
//       },
//       price:125,
//       quantity:3,
//       image:"white43.jpg"
//     }
//  ]
// }