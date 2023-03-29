
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



module.exports = {
    registerUser,
    loginUser,
    getUser
}