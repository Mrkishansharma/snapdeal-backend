const jwt = require('jsonwebtoken');
require('dotenv').config();



const Auth = (req,res, next)=>{
    const authToken = req.headers.authorization
    if(!authToken){
        return res.status(404).send({
            "msg":"Token Not Found",
            "Code":404,
            "Success":false
        })
    }
    const token = authToken.trim().split(' ')[1]

    try {
        
        const decoded = jwt.verify(token, process.env.SecretKey);
        if(decoded){
            req.body.UserID = decoded.UserID;
            next()
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


module.exports = Auth