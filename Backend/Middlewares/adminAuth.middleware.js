const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user.model');
require('dotenv').config()

const adminAuth  = async (req,res,next)=>{
    const authToken = req.headers.authorization
    if(!authToken){
        return res.status(400).send({
            "msg":"Login First",
            "Code":400,
            "Success":false
        })
    }
    const token = authToken.trim().split(' ')[1]

    try {
        
        const decoded = jwt.verify(token, process.env.SecretKey);
        if(decoded){

            const user1  = await UserModel.findById({_id:decoded.UserID});
            
            if(user1.isAdmin){

                req.body.AdminID = decoded.UserID;

                next()

            }else{

                return res.status(400).send({
                    "msg":"Access Denied. Unauthorized Access 🚫",
                    "Code":400,
                    "Success":false
                })

            }
        }else{
            return res.status(400).send({
                "msg":"Token Invalid",
                "Code":400,
                "Success":false
            })
        }

    } catch (error) {
        return res.status(400).send({
                "error":error.message,
                "msg":"Invalid Token",
                "Code":400,
                "Success":false
            })
    }
}
module.exports = adminAuth