const OrderModel = require('../Models/order.model');

const CartModel = require('../Models/cart.model');

const UserModel = require('../Models/user.model');

const ProductModel = require('../Models/product.model')



const placeOrder = async (req,res) => {

    let {UserID, Orders} = req.body;

    let flag = false

    let myOrders = Orders.map((ele)=>{
        if(ele.Quantity <= 0){
            flag = true
            return 
        }
        return {
            product: ele.ProductID, Quantity:ele.Quantity, Address:ele.Address, Status:"Confirmed"
        }
    })

    if(flag){
        return res.status(400).send({
            "Success":false,
            "Code":400,
            "msg":"Quantity Invalid!"
        })
    }


    try {
        
        const exist = await OrderModel.findOne( { UserID : UserID } );

        if(exist){

            exist.Products.push(...myOrders);

            try
                {
                   await OrderModel.findByIdAndUpdate({_id:exist._id}, exist);


                   for(let i=0; i<myOrders.length; i++){
                    
                        const p = await ProductModel.findById( {_id : myOrders[i].product } )
                
                        p.Quantity = (+p.Quantity) - (+myOrders[i].Quantity);
                
                        await ProductModel.findByIdAndUpdate( {_id : myOrders[i].product }, p )
                
                    }

                   return res.status(200).send({
                        "Success" : true,
                        "Code" : 200,
                        "msg" : "Order has been Successfully Placed",
                        "Orders" : exist
                    })

                }catch(er){

                    return res.status(400).send({
                        "Success" : false,
                        "Code" : 400,
                        "error" : er.message,
                        "msg" : "Something Went Wrong"
                    })

                }

        }else{

            try {
                
                const order = new OrderModel( {
                    UserID: UserID,
                    Products : [ ...myOrders ]
                } )

                await order.save();


                // Manage Quantity of Products

                for(let i=0; i<myOrders.length; i++){
                    
                    const p = await ProductModel.findById( {_id : myOrders[i].product } )
            
                    p.Quantity = (+p.Quantity) - (+myOrders[i].Quantity);
            
                    await ProductModel.findByIdAndUpdate( {_id : myOrders[i].product }, p )
            
                }


                return res.status(200).send({
                    "Success" : true,
                    "Code" : 200,
                    "msg" : "Order has been Successfully Placed",
                    "Orders" : order
                })

            } catch (error) {
                
                return res.status(400).send({
                    "Success" : false,
                    "Code" : 400,
                    "error" : error.message,
                    "msg" : "Something Went Wrong."
                })

            }
        }

    } catch (error) {
        return res.status(400).send({
            "Success" : false,
            "Code" : 400,
            "error" : error.message,
            "msg" : "Something Went Wrong."
        })
    }

    
} 



const cancelOrder = async (req,res) =>{

    const {ID} = req.params;

    const {UserID} = req.body;

    try {

        const order = await OrderModel.findOne( { UserID } )

        let isDelivered = false;
        let isCanceled = false;


        let canceledProduct;
        let cancelQunatity;


        order.Products.map((ele)=>{
            // console.log('========>', ele);

            if( ele._id == ID){

                if(ele.Status === 'Delivered'){
                    isDelivered = true
                    return 
                }

                if(ele.Status === 'Canceled'){
                    isCanceled = true
                    return 
                }

                canceledProduct = ele.product
                cancelQunatity = ele.Quantity

                ele.Status = 'Canceled'
                return true

            }

        })

        // console.log(cancelQunatity, canceledProduct);


        if(isDelivered){

            return res.status(400).send({
                "Success":false,
                "Code":400,
                "msg":"Order has been Already Delivered. No Cancelation for Delivered Products"
            })

        }else if(isCanceled){

            return res.status(400).send({
                "Success":false,
                "Code":400,
                "msg":"Order has been Already Canceled."
            })

        }else{

            // console.log('id===>', order._id);

            await OrderModel.findByIdAndUpdate( { _id: order._id }, order )



            // Manage Quanntity afer cancelation = Increase quantity

            const p = await ProductModel.findById( {_id :  canceledProduct} )
                
            p.Quantity = (+p.Quantity) + (+cancelQunatity);
    
            await ProductModel.findByIdAndUpdate( {_id :  canceledProduct}, p )


            return res.status(200).send({
                "Success":true,
                "Code":200,
                "msg":"Order has been Successfully Canceled."
            })

        }


    } catch (error) {

        return res.status(400).send({
            "Success": false,
            "Code": 400,
            "msg": "Something Went Wrong",
            "error":error.message
        })

    }
}



const getOrders = async (req, res) => {

    try{

        const getData=await OrderModel.findOne({UserID:req.body.UserID}).populate("Products.product")
        
        if(getData){

            return res.status(200).send({
                "Success":true,
                "Code": 200,
                "msg": "Your Orders ",
                "orders": getData
            })

        }else{
            return res.status(400).send({
                "Success": false,
                "Code": 400,
                "msg": "Your Order List is Empty"
            })
        }

    }catch(error){
        return res.status(400).send({
            "Success": false,
            "Code": 400,
            "msg": "Something Went Wrong",
            "error":error.message
        })
    }
}



// ADMIN Protected
const getAllOrders = async (req, res) => {

    try{

        const getData=await OrderModel.find().populate("Products.product")
        
        if(getData){

            return res.status(200).send({
                "Success":true,
                "Code": 200,
                "msg": "All Orders ",
                "orders": getData
            })

        }else{
            return res.status(400).send({
                "Success": false,
                "Code": 400,
                "msg": "Your Order List is Empty"
            })
        }

    }catch(error){
        return res.status(400).send({
            "Success": false,
            "Code": 400,
            "msg": "Something Went Wrong",
            "error":error.message
        })
    }
}


const updateOrderStatus = async (req,res) =>{

    const {ID} = req.params;

    try {

        const order = await OrderModel.find()

        // console.log(order);

        let orderedID;
        let dataForUpdate;

        let isDelivered = false;
        let isCanceled = false;

        let flag = false

        for(let i=0; i<order.length; i++){

            order[i].Products.map((ele)=>{
    
                if( ele._id == ID){
    
                    if(ele.Status === 'Delivered'){
    
                        isDelivered = true
                        return 
    
                    }else if(ele.Status === 'Canceled'){
    
                        isCanceled = true
                        return 
    
                    }else{

                        orderedID = order[i]._id
                        dataForUpdate = order[i]

                        ele.Status = 'Delivered'

                        flag = true

                        return true
    
                    }
                }
            })
            if(flag){
                break
            }
        }

        if(isDelivered){

            return res.status(400).send({
                "Success":false,
                "Code":400,
                "msg":"Order has been Already Delivered."
            })

        }else if(isCanceled){

            return res.status(400).send({
                "Success":false,
                "Code":400,
                "msg":"Order has been Canceled By User"
            })

        }else{

            // console.log(orderedID);

            await OrderModel.findByIdAndUpdate( { _id: orderedID }, dataForUpdate );


            return res.status(200).send({
                "Success":true,
                "Code":200,
                "msg":"Order has been Successfully Delivered."
            })

        }


    } catch (error) {

        return res.status(400).send({
            "Success": false,
            "Code": 400,
            "msg": "Something Went Wrong",
            "error":error.message
        })

    }
}




module.exports = {
    placeOrder,
    getOrders,
    getAllOrders,
    cancelOrder,
    updateOrderStatus
}
