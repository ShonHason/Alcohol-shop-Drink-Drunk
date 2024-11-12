const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var path = require('path');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


mongoose.connect("mongodb+srv://rotem11ziv11:123MONGO@cluster0.m9w53xq.mongodb.net/DrinkBuddies", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to the MongoDB database');
});


const removeProductRouter = require("./routes/removeProduct")
const updatePriceRouter = require("./routes/updatePrice")
const managerPageRouter = require("./routes/managerPage")
//const searchRouter = require("./routes/search")
const contactUsRouter = require("./routes/contactUs")
const aboutUsRouter = require("./routes/aboutUs")
const homeRouter = require("./routes/home")
const beersRouter = require("./routes/beers")
const vodkaRouter = require("./routes/vodka")
const wineRouter = require("./routes/wines")
const salesRouter = require("./routes/sales")
const pRouter = require("./routes/purchase")
const whiskyRouter = require("./routes/whisky")
const whyUsRouter = require("./routes/whyUs")
const shoppingCartRouter = require("./routes/shoppingCart")
const allItemsRouter = require("./routes/allitems")
const addProductRouter = require("./routes/addProduct")


app.use('/home', homeRouter)
app.use('/Beers', beersRouter)
app.use('/beers', beersRouter)
app.use('/Vodka', vodkaRouter)
app.use('/Whisky',whiskyRouter)
app.use('/Wines', wineRouter)
app.use('/sales', salesRouter)
app.use('/purchase', pRouter)
app.use('/contactUs', contactUsRouter)
app.use('/aboutUs', aboutUsRouter)
app.use('/whyUs', whyUsRouter)
app.use('/shoppingCart', shoppingCartRouter)
app.use('/AllItems', allItemsRouter);
app.use('/allitems', allItemsRouter);
//app.use('/search', searchRouter)
app.use('/addProduct', addProductRouter)
app.use('/managerPage', managerPageRouter)
app.use('/updatePrice', updatePriceRouter)
app.use('/removeProduct', removeProductRouter)
app.use(express.static('public'));

///////First Page//////////////
app.get('/', (req, res) => {
    res.render("home")
})
app.get('/search', (req, res) => {
    res.render("search")

})

const Users = require("./controllers/users"); // Make sure the correct import path is used

app.get('/login', async (req, res) => {
    res.render("login.ejs");
});

app.post('/login', async (req, res) => {
    try {
        const check = await Users.findOne({ Username: req.body.name })
        if (check.Password === req.body.password) {

            if (check.Role === "Admin" || check.Role === "admin") {
                res.redirect('/managerPage'); // Redirect to admin dashboard or page
            } else {
                res.cookie('username', check.Username, { maxAge: 3600000, httpOnly: true });            
                console.log(check.Username);
                res.redirect('/home'); // Redirect to user dashboard or page
            }
        }
        else {
            res.send("wrong password")
        }
    }
    catch {
        res.send("Wrong details")
    }
    });


app.get('/signup', (req, res) => {
    res.render("signup.ejs");
})

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists in the database
        const existingUser = await Users.findOne({ Username: username });

        if (existingUser) {
            return res.send('Username already exists.');
        }

        // Create a new user if the username is not found
        const newUser = new Users({ Username: username, Password: password, Role: "Customer" });
        await newUser.save();
        res.cookie('username', newUser.Username, { maxAge: 3600000, httpOnly: true });         
           console.log(newUser.id)
        res.render('home');
    } catch (error) {
        console.error(error);
        res.send('An error occurred.');
    }
});
const Product = require("./controllers/products"); // Make sure the correct import path is used

app.post('/search/search', async (req, res) => {
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

  app.get('/search/:Catergory/:Name', async (req, res) => {

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

  


app.listen(3000)