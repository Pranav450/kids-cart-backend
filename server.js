const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Get all products
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Place order (reduce inventory)
app.post("/order/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock > 0) {
            product.stock -= 1;
            await product.save();

            res.json({
                message: "Order placed",
                product
            });
        } else {
            res.status(400).json({
                message: "Out of stock"
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
