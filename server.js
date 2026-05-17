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
// Add default products to database (run once)
app.get("/seed", async (req, res) => {
    try {

        const existingProducts = await Product.find();

        if (existingProducts.length > 0) {
            return res.json({
                message: "Products already exist"
            });
        }

        const products = [
            {
                name: "Kids Hoodie",
                price: 999,
                image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700",
                stock: 100
            },
            {
                name: "Girls Dress",
                price: 1499,
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700",
                stock: 100
            },
            {
                name: "Kids Shoes",
                price: 1999,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
                stock: 100
            }
        ];

        await Product.insertMany(products);

        res.json({
            message: "Products added successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
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
