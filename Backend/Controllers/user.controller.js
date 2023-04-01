
const UserModel = require('../Models/user.model');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

require('dotenv').config();


const registerUser = async (req, res) => {

    const { Name, Email, Contact, Password, Location, Gender } = req.body;

    if (!Name || !Email || !Contact || !Password || !Location || !Gender) {
        return res.status(400).send({
            "msg": "Something Went Wrong. Please Provide All the Information",
            "Code": 400,
            "Success": false
        })
    }
    if (!(Gender == "Male" || Gender == "Female")) {
        return res.status(400).send({
            "msg": "Gender must be Male or Female",
            "Code": 400,
            "Success": false
        })
    }

    const isAdmin = false;



    bcrypt.hash(Password, 5, async (err, hash) => {

        if (err) {

            return res.status(400).send({
                "error": err,
                "msg": "Something Went Wrong. Please Retry Again",
                "Code": 400,
                "Success": false
            })

        } else {
            try {
                const user = new UserModel({
                    Name, Email, Contact, Password: hash, Location, Gender, isAdmin
                })

                await user.save()

                return res.status(200).send({
                    "msg": "Registration Successfull.",
                    "Code": 200,
                    "Success": true,
                    "UserData": user
                })

            } catch (error) {
                return res.status(400).send({
                    "error": error.message,
                    "msg": "User Already Present",
                    "Code": 400,
                    "Success": false
                })
            }

        }
    })
}


const loginUser = async (req, res) => {

    const { Email, Password } = req.body;

    try {
        const verifyUser = await UserModel.findOne({ Email });

        if (verifyUser) {

            bcrypt.compare(Password, verifyUser.Password, (err, result) => {

                if (result) {

                    return res.status(200).send({
                        "msg": "Login Successfull.",
                        "Code": 200,
                        "Success": true,
                        "token": jwt.sign({ UserID: verifyUser._id }, process.env.SecretKey, { expiresIn: '12h' })
                    })

                } else {

                    return res.status(400).send({
                        "msg": "Invalid Password. Wrong Credentials",
                        "Code": 400,
                        "Success": false
                    })

                }
            })
        } else {

            return res.status(404).send({
                "msg": "User Not Found",
                "Code": 404,
                "Success": false
            })

        }
    } catch (error) {

        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong",
            "Code": 400,
            "Success": false
        })

    }
}



const getUser = async (req,res)=>{

    const { UserID } = req.body;

    try {
        
        const user = await UserModel.findById({_id:UserID});

        res.status(200).send({

            "Success":true,
            "Code":200,
            "UserData":user

        })
    } 
    
    catch (error) {
        
        res.status(400).send({
            "error":error.message,
            "Code":400,
            "Success":false,
            "msg":"Something Went Wrong!"
        })
    }
}



const updateUser = async (req,res) => {

    const { UserID } = req.body;

    const payload = req.body;

    if(payload.Gender || payload.Gender=='' || payload.Gender===null){

        if (!(payload.Gender == "Male" || payload.Gender == "Female")) {

            return res.status(400).send({
                "msg": "Gender must be Male or Female",
                "Code": 400,
                "Success": false
            })

        }

    }

    try {

        const user = await UserModel.findById( { _id : UserID } );

        if(user){

            payload.isAdmin = user.isAdmin;

            if(user.Email === 'admin@gmail.com'){

                payload.Email = 'admin@gmail.com'
                
            }
    
            await UserModel.findByIdAndUpdate( { _id : UserID }, payload )
    
            const updatedUser = await UserModel.findById( { _id : UserID } )
    
            return res.status(200).send({
                "Code":200,
                "Success":true,
                "msg": "User Detatils Successfully updated",
                "UserData" : updatedUser
            })
            
        }else{
            
            return res.status(404).send({
                "Code":404,
                "Success":false,
                "msg": "User Doesn't Exits."
            })

        }
        
    } catch (error) {

        return res.status(400).send({
            "Code":400,
            "Success":false,
            "msg": "Something Went Wrong",
            "error" : error.message
        })

    }


}


const deleteUser = async (req,res) => {

    const { UserID } = req.body;

    try {

        const user = await UserModel.findById( { _id : UserID } );

        if(user){

            if(user.Email === 'admin@gmail.com'){

                return res.status(400).send({
                    "Success" : false,
                    "Code" : 400,
                    "msg" : "Access Denied => Can't remove standard crendentials."
                })

            }
    
            const deletedUser = await UserModel.findByIdAndDelete( { _id : UserID } )
    
            return res.status(200).send({
                "Code":200,
                "Success":true,
                "msg": "User Successfully Deleted",
                "UserData": deletedUser
            })
            
        }else{
            
            return res.status(404).send({
                "Code":404,
                "Success":false,
                "msg": "User Doesn't Exits."
            })

        }
        
    } catch (error) {

        return res.status(400).send({
            "Code":400,
            "Success":false,
            "msg": "Something Went Wrong",
            "error" : error.message
        })

    }


}

const updateRole = async (req,res) => {

    const {UserID, isAdmin} = req.body

    try {
        
        const user = await UserModel.findById( { _id : UserID } );

        if(user.Email === 'admin@gmail.com'){

            return res.status(400).send({
                "Success": false,
                "Code": 400,
                "msg" : "Access Denied. => You can't able to update this account"
            })

        }

        await UserModel.findByIdAndUpdate( {_id : UserID }, { isAdmin } )

        return res.status(200).send({
            "Success": true,
            "Code": 200,
            "msg" : "User Role Successfully Updated."
        })

    } catch (error) {
        
        return res.status(400).send({
            "Success": false,
            "Code": 400,
            "msg" : "Something Went Wrong",
            "error" : error.message
        })

    }

}


const getAllUsers = async (req, res) => {

    let {search, limit, page, isAdmin} = req.query;

    if(!limit) limit = 20

    try {

        const searchFilter = new RegExp(search, 'i');

        if(isAdmin===undefined){

            const users = await UserModel.find( { Name : searchFilter } ).skip(limit*(page-1)).limit(limit)

            return res.status(200).send({
                "Success" : true,
                "Code" : 200,
                "Users" : users ,
                "msg" : "Successfully get Users"
            })

        }else{

            const users = await UserModel.find( { Name : searchFilter, isAdmin } ).skip(limit*(page-1)).limit(limit)
    
            return res.status(200).send({
                "Success" : true,
                "Code" : 200,
                "Users" : users ,
                "msg" : "Successfully get Users"
            })

        }

    } catch (error) {
        
        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong!",
            "Code": 400,
            "Success": false
        })

    }

}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    updateRole,
    getAllUsers
}