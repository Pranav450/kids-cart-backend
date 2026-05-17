const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number
});

const Product = mongoose.model("Product", productSchema);

// GET all products
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// PLACE ORDER
app.post("/order/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock <= 0) {
            return res.status(400).json({
                message: "Out of stock"
            });
        }

        product.stock -= 1;
        await product.save();

        res.json({
            message: "Order placed successfully",
            updatedStock: product.stock
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
