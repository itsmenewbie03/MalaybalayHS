const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    productStatus: {
      type: String,
    },
    productImage:{
      data: Buffer,
      contentType: String
    },
    createdAt:{
      type: Date,
      default: Date.now // Using Date.now as the default value for createdAt
    }
  })

  const Product = mongoose.model("product", productSchema)
  module.exports = Product