const mongoose=require('mongoose')

const productSchema=mongoose.Schema(
    {
        Pname:{
            type:String,
            required:true
        },
        Price:{
            type:Number,
            required:true
        },
        Description:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        Image:[],

     
    },
    {timestamps:true}
)

const productModel=mongoose.model("products",productSchema)
module.exports=productModel