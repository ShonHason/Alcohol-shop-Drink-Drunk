
const express = require("express")
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used
const cookieParser = require('cookie-parser');
const User = require("../server");
router.use(cookieParser());


router.get("/", async (req, res) => {
    res.render("addProduct"); // Pass the products to the template
});

router.post("/", async (req, res) => {
    try {
      const newProduct = new Product({
        Name: req.body.productName,
        Price: req.body.productPrice,
        Link: req.body.productLink,
        Description: req.body.productDescription,
        Catergory: req.body.productCategory
      });

      await newProduct.save();
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: error.message
      });
    }
  });

  module.exports = router;

