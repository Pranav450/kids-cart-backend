const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/product/:item", async (req, res) => {
  const product = await Product.findOne({
    item: req.params.item
  });

  res.json(product);
});

router.post("/order", async (req, res) => {
  const { item } = req.body;

  const product = await Product.findOne({ item });

  if (!product || product.stock <= 0) {
    return res.status(400).json({
      message: "Out of stock"
    });
  }

  product.stock -= 1;

  await product.save();

  res.json({
    success: true,
    stock: product.stock
  });
});

module.exports = router;
