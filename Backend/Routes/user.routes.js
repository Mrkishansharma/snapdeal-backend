const { Router } = require('express');

const { registerUser, loginUser, getUser, updateUser, deleteUser, updateRole, getAllUsers} = require('../Controllers/user.controller');

const adminAuth = require('../Middlewares/adminAuth.middleware');

const Auth = require('../Middlewares/Auth.middleware');


const userRouter = Router();



userRouter.post('/register', registerUser)

userRouter.post('/login', loginUser)




userRouter.get("/get", Auth , getUser)

userRouter.patch('/update', Auth, updateUser)

userRouter.delete('/delete', Auth, deleteUser)



userRouter.patch('/updateRole', adminAuth, updateRole);

userRouter.get('/getall', adminAuth, getAllUsers);

module.exports = userRouter;