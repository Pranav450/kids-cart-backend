const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  item: String,
  name: String,
  price: Number,
  stock: Number,
  image: String
});

module.exports = mongoose.model("Product", productSchema);
