const express = require("express");
const router = express.Router();
const Product = require("../controllers/products"); // Make sure the correct import path is used



router.get('/', async (req, res) => {
    const products = await Product.find({ Catergory: { $in: ["Worldwide beers", "Israel's beers"] } });
    console.log(products); // Debugging: Print the retrieved products
    res.render('someProducts', { products }); // Pass the products to the template
});

router.get('/IsraeliBeers', async (req, res) => {
    const products = await Product.find({ Catergory: "Israel's beers" });
    res.render('someProducts', { products }); // Pass the category to the template
});

router.get('/WorldWideBeers', async (req, res) => {
    const products = await Product.find({ Catergory: 'Worldwide beers' });
    res.render('someProducts', { products }); // Pass the category to the template
});
router.get('/:Catergory/:Name', async (req, res) => {
    const name = decodeURIComponent(req.params.Name) // work with the ejs that makes the url in some product.ejs ////
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
        res.status(500).send('error');
    }
});

module.exports = router;


router.post('/', async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory: { $in: ["Worldwide beers", "Israel's beers"] }}).sort({ Name: 1 }); // Sort by product name
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: { $in: ["Worldwide beers", "Israel's beers"] }}); // Fetch all products
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

router.post('/WorldWideBeers', async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory: "Worldwide beers" }).sort({ Name: 1 }); // Sort by product name
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: "Worldwide beers" }); // Fetch all products
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

router.post('/IsraeliBeers', async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory: "Israel's beers" }).sort({ Name: 1 }); // Sort by product name
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: "Israel's beers" }); // Fetch all products
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