const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    Email : {type:String, required:true, unique:true},
    Name : {type:String, required:true},
    Contact : {type:Number, required:true},
    Gender : {type:String, required:true, enum:["Male","Female"]},
    Location : {type:String, required:true},
    Password : {type:String, required:true},
    isAdmin :  {type:Boolean}
},{
    versionKey:false,
    timestamps:true
})


const UserModel = mongoose.model('user', userSchema);


module.exports = UserModel;