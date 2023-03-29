const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    Image:{type:String, required:true},
    Title:{type:String, required:true},
    Category:{type:String, required:true},
    Description:{type:String, required:true},
    Price:{type:Number, required:true},
    Rating:{type:Number, required:true},
    Quantity:{type:Number, required:true}


},
    {
        versionKey:false,
        timestamps :true
    
    }
)


const ProductModel = mongoose.model("product",productSchema)

module.exports = ProductModel;