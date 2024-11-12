const express = require("express")
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used

router.get('/', async (req, res) => {
    const products = await Product.find({ Catergory: { $in: ["RED", "WHITE", "ROSE"] } });
    console.log(products); // Debugging: Print the retrieved products
    res.render('someProducts', { products }); // Pass the products to the template
});
router.get('/RED', async(req, res) => {
    const products = await Product.find({  Catergory :"RED" })
    res.render('someProducts',{products})

})
router.get('/ROSE', async(req, res) => {
    const products = await Product.find({  Catergory :"ROSE" })
    res.render('someProducts',{products})
})

router.get('/WHITE',async (req, res) => {
    const products = await Product.find({  Catergory :"WHITE" })
    res.render('someProducts',{products})

})

////////////////////////////one product////////
router.get('/:Catergory/:Name', async(req, res) => {
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
        res.status(500).render('error', { message: 'Internal server error' });
    }
});


router.post('/', async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory: { $in: ["WHITE", "RED", "ROSE"] } }).sort({ Name: 1 });
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: Vodka}); // Fetch all Vodka
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


router.post('/RED', async(req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory:  "RED"}).sort({ Name: 1 });
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: "RED"}); // Fetch all red wine
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

router.post('/ROSE', async(req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory: "ROSE"  }).sort({ Name: 1 });
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: "ROSE"}); // Fetch all Vodka
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

router.post('/WHITE',async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find({ Catergory: "WHITE" }).sort({ Name: 1 });
        } else if (sortBy === 'product-price') {
            products = await Product.find({ Catergory: "WHITE"}); // Fetch all Vodka
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






/*
    router.get('/:Catergory/:Name', async (req, res) => {
        const category = req.params.Catergory; // Retrieve the category parameter
        const name = req.params.Name; // Retrieve the name parameter
    
        try {
            // Query your MongoDB collection using both the Category and Name
            const products = await Product.find({ Catergory: category, Name: name });
    
            if (!products || products.length === 0) {
                // Product not found, handle accordingly (e.g., render error template)
                return res.render('error', { message: 'Product not found' });
            }
    
            // Render the product detail page with the retrieved products
            res.render('productDetail', { products });
        } catch (error) {
            // Handle any errors that occur during database query or rendering
            console.error(error);
            res.status(500).render('error', { message: 'Internal server error' });
        }
    });


    router.get('/:ROSE/:Name', async(req, res) => {
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

    router.get('/:RED/:Name', async(req, res) => {
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
})
*/


module.exports = router



  