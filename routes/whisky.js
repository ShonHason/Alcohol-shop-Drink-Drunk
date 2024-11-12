const express = require("express")
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used

router.get('/', async (req, res) => {
    const products = await Product.find({ Catergory:"Whisky" });
    console.log(products); // Debugging: Print the retrieved products
    res.render('someProducts.ejs', { products }); // Pass the products to the template
});
module.exports = router
router.get('/:Name', async(req, res) => {
    const name = req.params.Name;
    try {
        // Query your MongoDB collection using both Category and Name
        const product = await Product.findOne({ Name: name });

        if (!product) {
            // Product not found, handle accordingly (e.g., render error template)
            return res.send('error');
        }

        // Render the product detail page with the retrieved product
        res.render('singleProduct', { product });
    } catch (error) {
        // Handle any errors that occur during database query or rendering
        console.error(error);
        res.status(500).render('error', { message: 'Internal server error' });
    }

})


router.post('/', async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {

            products = await Product.find({ Catergory: "Whisky" }).sort({ Name: 1 }); // Sort by product name
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: "Whisky"}); // Fetch all whisky
            products.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price)); // Sort by price as numbers
        } else {
            // Handle invalid sorting option
            return res.status(400).send('Invalid sorting option');
        }

        res.render('allitems', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});      
