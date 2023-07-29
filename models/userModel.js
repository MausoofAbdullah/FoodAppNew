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
       
        
       
        livesin:String,
        worksAt:String,
        relationship:String,
        country:String,
     
        Active:{
            type:Boolean,
            default:true
        },
     
    },
    {timestamps:true}
)

const UserModel=mongoose.model("users",UserSchema)
module.exports=UserModel