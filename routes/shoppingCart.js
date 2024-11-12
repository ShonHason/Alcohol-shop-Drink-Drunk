const express = require("express")
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const Users = require("../controllers/users"); // Make sure the correct import path is used
const orders = require("../controllers/order"); // Make sure the correct import path is used


router.get('/', async (req, res) => {
  const username = req.cookies.username;

  try {
    const user = await Users.findOne({ Username: username }).populate('cart.productId');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('shoppingCart', { user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/Add', async (req, res) => {
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
      const redirectUrl = req.originalUrl.replace('/Add', '');

      res.redirect('/shoppingCart'); // Redirect to the product listing page
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(400).send('Invalid request');
  }
});


router.post('/remove', async (req, res) => {
  const productId = req.body.productId; // Get the product ID from the form submission
  const username = req.cookies.username; // Get the username from cookies

  try {
    // Find the user by username
    const user = await Users.findOne({ Username: username });

    if (!user) {
      return res.status(404).send('User not found');
    }
    // Remove the item from the cart based on the product ID
    console.log('Received productId:', productId); // Access the _id property

    user.cart = user.cart.filter(item => !item.productId.equals(productId));

    // Save the updated user
    await user.save();

    res.redirect('/shoppingCart'); // Redirect back to the cart page
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/update-cart', async (req, res) => {
  const productId = req.body.productId; // Get the product ID from the form submission
  const quantity = parseInt(req.body.quantity); // Get the updated quantity from the form submission
  const username = req.cookies.username; // Get the username from cookies

  try {
    // Find the user by username
    const user = await Users.findOne({ Username: username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the index of the cart item with the specified product ID
    const cartItemIndex = user.cart.findIndex(item => item.productId.equals(productId));

    if (cartItemIndex !== -1) {
      // Update the quantity of the cart item
      user.cart[cartItemIndex].quantity = quantity;

      // Save the updated user
      await user.save();
    }

    res.redirect('/shoppingCart'); // Redirect back to the cart page
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.post('/make-order', async (req, res) => {
  const totalPrice = parseFloat(req.body.totalPrice); // Get the total price from the form
  const username = req.cookies.username; // Get the username from cookies
  const orderNumber = generateRandomOrderNumber(); // Replace this with your own logic for generating order numbers

  try {
    // Find the user by username
    const user = await Users.findOne({ Username: username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Clear the cart
    user.cart = [];

    // Save the updated user
    await user.save();

    // Create a new order document in your database
    const newOrder = new orders({
      username: user.Username,
      orderNumber: orderNumber,
      totalPrice: totalPrice
    });
    await newOrder.save();

    res.redirect('/shoppingCart'); // Redirect back to the cart page
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

function generateRandomOrderNumber() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const orderNumber = 'ORD' + randomNumber.toString().padStart(4, '0');
  return orderNumber;
}






module.exports = router