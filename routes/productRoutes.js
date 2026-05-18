const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// GET all products
router.get("/", async (req, res) => {

    try {

        const products =
            await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


// PLACE ORDER
router.post("/order", async (req, res) => {

    const { item } = req.body;

    try {

        const product =
            await Product.findOne({
                name: item
            });

        if (!product || product.stock <= 0) {

            return res.status(400).json({
                message: "Out of stock"
            });
        }

        product.stock -= 1;

        await product.save();

        res.json({
            message:
                "Order placed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;
