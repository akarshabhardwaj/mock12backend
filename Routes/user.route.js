const express = require('express');
const { UserModel } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const UserRouter=express.Router()

UserRouter.post("/register",async (req,res)=>{
   try {
    const{email,name,password}=req.body
    const isPresent=await UserModel.findOne({email})
    if(isPresent)
    {
        res.send({"msg":"Already a user Please Login"})
    }
    else
    {
        bcrypt.hash(password, 5, (err, hash)=> {
            if(err)
            {
                res.send({"msg":"Please Check details"})
            }
            else
            {
                const user=new UserModel({email,password:hash,name})
                user.save()
                res.send({"msg":"successfully registered"})
            }
        });
    }
   } catch (error) {
    res.send({"msg":error.message})
   }
})


UserRouter.post("/login",async (req,res)=>{
    const{email,password,name}=req.body
    try {
        const user=await UserModel.find({email})
        if(user.length>0)
        {
            bcrypt.compare(password, user[0].password, function(err, result) {
               if(result===true)
               {
                const token = jwt.sign({ UserId: user[0]._id }, 'Maturity');
                res.send({"msg":"Successfully Logged In",token})
               }
               else
               {
                res.send({"msg":"check  Pasword"})
               }
            });
        }
        else
        {
            res.send({"msg":"check  email and Pasword"})
        }
    } catch (error) {
        res.send({"msg":error.message})
    }
})


module.exports={UserRouter}