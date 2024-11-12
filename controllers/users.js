const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
    Username:
    {
        type: String,
        required: true,
        unique: true
    },
    Password:
    {
        type: String,
        required: true
    },
    Role:
    {
        type: String,
        required: true,
        default: "Customer" 
    },

  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ],

  wishlist: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    }
  ],
  
  
});


const Users = mongoose.model('Users', UsersSchema) // User is our connection to the schema in mongo
module.exports = Users;
 