const {Router} = require('express');

const {placeOrder, getOrders, getAllOrders, cancelOrder, updateOrderStatus} = require('../Controllers/order.controller');

const adminAuth = require('../Middlewares/adminAuth.middleware');

const Auth = require('../Middlewares/Auth.middleware')

const orderRouter = Router();



orderRouter.post('/place',Auth ,placeOrder);

orderRouter.get('/get', Auth, getOrders);


orderRouter.delete('/cancel/:ID', Auth,  cancelOrder)


orderRouter.get('/getall', adminAuth, getAllOrders)


orderRouter.patch('/updateStatus/:ID', updateOrderStatus)


module.exports = orderRouter;