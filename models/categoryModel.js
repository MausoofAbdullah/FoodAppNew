const mongoose=require('mongoose')

const CategorySchema=mongoose.Schema(
    {
        CategoryName:{
            type:String,
            required:true
        }
     
    },
    {timestamps:true}
)

const CategoryModel=mongoose.model("category",CategorySchema)
module.exports=CategoryModel