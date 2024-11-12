const mongoose = require('mongoose');

// Define the Product schema
const ProductSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Price: {
        type: String,
        required: true
    },
    Link: {
        type: String

    },
    Description: {
        type: String
    },
    Catergory: {
        type: String,
        required: true
    }
},
    { versionKey: false }
);

/*
const products = new Products({

    Name: "Sh0on",
    Price: "45NIS",
    Link: "WWW.SHONHARA.COM",
    Description: "getVersion",
    Catergory:"Nasa",
})
products.save();
module.exports = {
    Products: Products // Export the 'Products' model
};
*/


// Create the Product model using the schema
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
