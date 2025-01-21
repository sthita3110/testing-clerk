import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    clerkId:{
        type: String,
        required: true,
        unique:true,
    },
}, {timestamps: true})

export const User = mongoose.Model("User", userSchema)