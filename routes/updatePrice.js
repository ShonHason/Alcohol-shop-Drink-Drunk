const express = require("express")
const app = express();
const router = express.Router()
const Product = require('../controllers/products')
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get('/', async (req, res) => {

    res.render("updatePrice")


})

module.exports = router

router.post('/updateProductPrice', async (req, res) => {
   
    try {
        const productName = req.body.productName;
        const newPrice = req.body.newPrice;

        // Update the product's price
        const result = await Product.updateOne(
            { Name: productName },
            { $set: { Price: newPrice } }
        );

        if (result.nModified === 0) {
            return res.send('Product not found');
        }

        res.redirect(`/updatePrice?success=true`);
        } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
  });