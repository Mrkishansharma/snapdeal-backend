const { Router } = require('express');

const { registerUser, loginUser, getUser} = require('../Controllers/user.controller')

const Auth = require('../Middlewares/Auth.middleware');


const userRouter = Router();

userRouter.post('/register', registerUser)


userRouter.post('/login', loginUser)


userRouter.get("/get", Auth , getUser)



module.exports = userRouter;