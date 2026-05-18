const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/products", productRoutes);

// Seed Route
app.get("/seed", async (req, res) => {
  try {
    await Product.deleteMany();

    const products = await Product.insertMany([
      {
        name: "Toy Car",
        price: 200,
        stock: 10,
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Teddy Bear",
        price: 500,
        stock: 8,
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Lego Set",
        price: 1200,
        stock: 5,
        image: "https://via.placeholder.com/150"
      },
    ]);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Kids Cart Backend Running");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
