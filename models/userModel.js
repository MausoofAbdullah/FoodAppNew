const mongoose=require('mongoose')

const UserSchema=mongoose.Schema(
    {
        Email:{
            type:String,
            required:true
        },
     
        Password:{
            type:String,
            required:true
        },
        Name:{
            type:String,
            required:true
        },
        Phone:{
            type:Number,
            required:true
        },
        isAdmin: {
            type: Boolean,
            default:false
          },
       
        livesin:String,
        worksAt:String,
        relationship:String,
        country:String,
     
       
     
    },
    {timestamps:true}
)

const UserModel=mongoose.model("users",UserSchema)
module.exports=UserModel