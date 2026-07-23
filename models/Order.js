const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
 items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    }
   , variantIndex: {
      type: Number,
      required: true
    },
  }
],
 totalPrice: {
  type: Number,
  default: 0 ,
 },
delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

status: {
  type: String,
  enum: [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled"
  ],
  default: "Pending"
},

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;