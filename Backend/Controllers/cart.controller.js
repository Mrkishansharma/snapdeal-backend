
const CartModel = require("../Models/cart.model");

const ProductModel = require("../Models/product.model");



const addToCart = async (req,res)=>{

    let {UserID, ProductID, Quantity} = req.body;

    if(!Quantity || Quantity<=0) Quantity=1

    if(!ProductID){

        return res.status(404).send({
            "Success":false,
            "Code":404,
            "msg" : "Product Not Found"
        })

    }else{

        try {

            const product = await ProductModel.findById({_id:ProductID});

        } catch (error) {

            return res.status(404).send({
                "error":error.message,
                "Success":false,
                "Code":404,
                "msg" : "Product Not Found"
            })

        }
    }

    try {
        
        const exist = await CartModel.findOne( { UserID : UserID } )
    
        // console.log(exist);

        if(exist){

            const checkCart = exist.Products.find((ele)=>{

                // console.log('==>',ele.product, ProductID);
                //For  Type Converison put (== inseted to ===)

                if(ele.product == ProductID){
                    return true
                }
            })

            // console.log(checkCart);

            if(checkCart){

                return res.status(400).send({
                    "Success":false,
                    "Code":400,
                    "msg":"Product Already Added Into Cart"
                })

            }else{
                
                exist.Products.push({ product: ProductID, Quantity: Quantity });

                // console.log(exist);

                try
                {
                   await CartModel.findByIdAndUpdate({_id:exist._id}, exist);

                   return res.status(200).send({
                        "Success" : true,
                        "Code" : 200,
                        "msg" : "Successfully Added Into Cart",
                        "CartData" : exist
                    })

                }catch(er){

                    return res.status(400).send({
                        "Success" : false,
                        "Code" : 400,
                        "error" : er.message,
                        "msg" : "Something Went Wrong"
                    })

                }

            }

        }else{

            try {
                
                const cart = new CartModel( {
                    UserID: UserID,
                    Products : [ { product: ProductID, Quantity: Quantity } ]
                } )

                await cart.save();

                return res.status(200).send({
                    "Success" : true,
                    "Code" : 200,
                    "msg" : "Successfully Added Into Cart",
                    "CartData" : cart
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



const getCartproduct = async(req,res)=>{
    try
    {
        const getData=await CartModel.findOne({UserID:req.body.UserID}).populate("Products.product")
        
        if(getData){

            return res.status(200).send({
                "Success":true,
                "Code": 200,
                "msg": "Your Cart Item Successfully GET.",
                "CartItem": getData
            })

        }else{
            return res.status(400).send({
                "Success": false,
                "Code": 400,
                "msg": "Your Cart is Empty"
            })
        }

    }catch(error)
    {
        return res.status(400).send({
            "Success": false,
            "Code": 400,
            "msg": "Something Went Wrong",
            "error":error.message
        })
    }
   
}



const updateCartItem = async(req,res)=>{

    const {ProductID} = req.params
    
    let {UserID, Quantity} = req.body;

    if(!Quantity || Quantity<=0) Quantity=1

    try{

        const userCart = await CartModel.findOne( { UserID } )

        const checkCart = userCart.Products.find((ele)=>{

            if(ele.product == ProductID){
                ele.Quantity = Quantity
                return true
            }

        })

        if(checkCart){
            
            try {
                
                await CartModel.findByIdAndUpdate({ _id : userCart._id }, userCart)        
        
                return res.status(200).send({
                    "Code":200,
                    "Success":true,
                    "msg":"Your Cart Successfully updated!",
                    "CartData": userCart
                })

            } catch (error) {
                return res.status(400).send({
                    "Code":400,
                    "Success":false,
                    "msg":"Something Went Wrong",
                    "error":error.message
                })
            }

        }else{

            return res.status(404).send({
                "Code":404,
                "Success":false,
                "msg":"Product Not Found"
            })

        }

        
    }catch(error){

        return res.status(400).send({
            "Code":400,
            "Success":false,
            "msg":"Your Cart Doesn't Exist",
            "error":error.message
        })

    }
    

}



const deleteCartItem = async (req,res) =>{

    const {ProductID} = req.params
    
    let { UserID } = req.body;


    try{

        const userCart = await CartModel.findOne( { UserID } )

        
        const afterDelete  = userCart.Products.reduce((acc, curr)=>{

            if( curr.product != ProductID ){

                acc.push(curr);

            }

            return acc

        },[])

        userCart.Products = afterDelete;
        
        try {
            
            await CartModel.findByIdAndUpdate({ _id : userCart._id }, userCart)        
    
            return res.status(200).send({
                "Code":200,
                "Success":true,
                "msg":"Your Cart Successfully Deleted!",
                "CartData": userCart
            })

        } catch (error) {

            return res.status(400).send({
                "Code":400,
                "Success":false,
                "msg":"Something Went Wrong",
                "error":error.message
            })

        }
        
    }catch(error){

        return res.status(400).send({
            "Code":400,
            "Success":false,
            "msg":"Your Cart Doesn't Exist",
            "error":error.message
        })

    }
   
}



module.exports = {
    addToCart,
    getCartproduct,
    updateCartItem,
    deleteCartItem
}