const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        default: 100
    }
});

module.exports = mongoose.model("Product", ProductSchema);
