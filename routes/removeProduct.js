const express = require("express");
const router = express.Router();
const Product = require('../controllers/products');

// Display the remove product form
router.get('/', (req, res) => {
    res.render("removeProduct");
});

// Handle the removal of a product
router.post('/removeProductForm', async (req, res) => {
    try {
        const productName = req.body.productName;

        // Remove the product by its name
        const result = await Product.deleteOne({ Name: productName });

        if (result.deletedCount === 0) {
            return res.send('Product not found');
        }

        res.send('Product removed successfully');
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
});

module.exports = router;
