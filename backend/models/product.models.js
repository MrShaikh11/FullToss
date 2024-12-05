const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  image: String,
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
