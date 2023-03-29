const {Router} = require('express');

const Auth = require('../Middlewares/Auth.middleware');

const {addToCart, getCartproduct, updateCartItem, deleteCartItem} = require('../Controllers/cart.controller')

const cartRouter = Router();

cartRouter.use(Auth);

cartRouter.post("/addToCart",addToCart );

cartRouter.get("/get",getCartproduct);

cartRouter.patch('/update/:ProductID', updateCartItem)

cartRouter.delete('/delete/:ProductID', deleteCartItem)

module.exports = cartRouter;