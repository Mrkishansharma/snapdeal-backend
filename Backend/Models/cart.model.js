const mongoose = require('mongoose');
const ProductModel = require('./product.model');
const UserModel = require('./user.model');

const cartSchema = mongoose.Schema({
    UserID : { type : mongoose.Schema.Types.ObjectId, ref : UserModel},
    Products:[ 
                { 
                    product : { type : mongoose.Schema.Types.ObjectId, ref : ProductModel }, 
                    Quantity : { type : Number, required : true}
                } 
            ]
},{
    versionKey:false,
    timestamps:true
})



const CartModel = mongoose.model('cart', cartSchema);


module.exports = CartModel;