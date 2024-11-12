const express = require("express")
const app = express();
const router = express.Router()
const Product = require("../controllers/products"); // Make sure the correct import path is used


router.get('/', (req, res) => {





    res.render("home.ejs")


})


module.exports = router

