const { Router } = require('express');

const adminAuth = require('../Middlewares/adminAuth.middleware');

const { getAllProducts, getOneProduct, getProdcutByCategory, createProduct, updateProduct, deleteProduct } = require('../Controllers/product.controller')

const productRouter = Router();


productRouter.get('/getall', getAllProducts)

productRouter.get('/getone/:productID', getOneProduct)

productRouter.get('/getbycategory/:Category', getProdcutByCategory)



// ADMIN Protected Routes => Don't touch

productRouter.use(adminAuth)

productRouter.post('/add', createProduct)

productRouter.patch("/update/:productID" , updateProduct)

productRouter.delete("/delete/:productID", deleteProduct)


module.exports = productRouter;