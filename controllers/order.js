const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: String,
    orderNumber: String,
    totalPrice: String
});


const orders = mongoose.model('Orders', orderSchema) // User is our connection to the schema in mongo
module.exports = orders;
 