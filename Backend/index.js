require('dotenv').config();
const express = require('express');

const { connection } = require('./Database/db');

const userRouter = require('./Routes/user.routes');

const productRouter = require('./Routes/product.routes');

const cartRouter = require('./Routes/cart.routes');

const orderRouter = require('./Routes/order.routes');




const app = express();

app.use(express.json());


app.use('/user',userRouter);

app.use('/product',productRouter);

app.use('/cart',cartRouter);

app.use('/order',orderRouter);


app.all('*', (req,res)=>{
    res.status(404).send({
        "msg":"404 Not Found",
        "Code":404,
        "Success":false
    })
})


app.listen(process.env.port, async (req,res)=>{

    try {

        await connection

        console.log(' DB Connected ');

    } catch (error) {

        console.log(error);

    }

    console.log(`Server is running on port ${process.env.port}`);
    
})