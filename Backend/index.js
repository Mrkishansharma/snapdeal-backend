const express = require('express');

require('dotenv').config();

const { connection } = require('./Database/db');

const userRouter = require('./Routes/user.routes');

const productRouter = require('./Routes/product.routes');

const cartRouter = require('./Routes/cart.routes');

const orderRouter = require('./Routes/order.routes');



const app = express();

app.use(express.json());



//user routers
app.use('/user',userRouter);

//product routers
app.use('/product',productRouter);

//cart routers
app.use('/cart',cartRouter);

//order routers
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