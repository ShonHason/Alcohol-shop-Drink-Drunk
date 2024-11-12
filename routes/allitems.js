const express = require("express")
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
router.use(cookieParser());



router.get('/', async (req, res) => {
    const products = await Product.find({});
    console.log(products); // Debugging: Print the retrieved products
    res.render('allitems', { products }); // Pass the products to the template
});
module.exports = router


router.post('/', async (req, res) => {
    try {
        const sortBy = req.body.sorting; // Get the selected sorting option

        let products;
        if (sortBy === 'product-name') {
            products = await Product.find().sort({ Name: 1 }); // Sort by product name
        } else if (sortBy === 'product-price') {
            products = await Product.find(); // Fetch all products
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
}
);   

  module.exports = router;

  
  router.post('/', async (req, res) => {
    try {
    
        const searchValue = req.body.query;
        // Replace "productName" with the actual field name in your MongoDB schema
        const products = await Product.find({ Name: { $regex: searchValue, $options: 'i' } }).limit(10);
        res.json(products);

    } catch (error) {
      console.error("Failed to search products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });
  const Users = require("../controllers/users"); // Make sure the correct import path is used


  router.post('/add', async (req, res) => {
    const productName = req.body.cartAction || req.body.wishlistAction;
    const actionType = req.body.cartAction ? 'cart' : 'wishlist';
    const username = req.cookies.username;

    if (productName) {
      try {
        const product = await Product.findOne({ Name: productName });
          console.log(productName);
        if (!product) {
          return res.status(404).send('Product not found');
        }
  
        console.log(username);

        const user = await Users.findOne({ Username: username });

        
        if (!user) {
          return res.status(404).send('User not found');

        }
  
        if (actionType === 'cart') {
          const existingCartItem = user.cart.find(item => item.productId.equals(product.id));
          if (existingCartItem) {
            existingCartItem.quantity += 1;
          } else {
            user.cart.push({ productId: product.id, quantity: 1 });
          }
        } else if (actionType === 'wishlist') {
          const existingWishlistItem = user.wishlist.find(item => item.productId.equals(product.id));
          if (existingWishlistItem) {
            existingWishlistItem.quantity += 1;

          } else {
            user.wishlist.push({ productId: product.id, quantity: 1 });
          }
        } else {
          return res.status(400).send('Invalid action type');
        }
  
        await user.save();
  
        res.redirect('/allitems'); // Redirect to the product listing page
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.status(400).send('Invalid request');
    }
  });