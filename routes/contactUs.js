const express = require("express")
const app = express();
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used


router.get('/',  (req, res) => {

    res.render("contactUs.ejs")


})
module.exports = router

router.post('/search', async (req, res) => {
    try {
    
        const searchValue = req.body.query;
        // Replace "productName" with the actual field name in your MongoDB schema
        const products = await Product.find({ Name: { $regex: searchValue, $options: 'i' } }).limit(10);
        res.render('someProducts' ,{products});
    } catch (error) {
      console.error("Failed to search products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });