const express = require('express');
require("dotenv").config()
const {connection}=require("./configs/db");
const { UserRouter } = require('./Routes/user.route');
const { authenticate } = require('./middleware/authenticate');
const { UserModel } = require('./models/user.model');
const cors = require('cors');


const app=express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send({"msg":"HomePage"})
})

app.use("/user",UserRouter)
app.get("/getProfile",async (req,res)=>{
    const users=await UserModel.find()
    res.send({"data":users})
})
app.use(authenticate)

app.post("/calculate",async (req,res)=>{
    const{p,r,n}=req.body
    let total_investment=p*n;
    let i=r/100
    let mv=Math.floor(p*((((1+i)**n)-1)/i))
    let interest=mv-p

    res.send({"msg":"Calculated","Maturity":mv,"total":total_investment,"Interest":interest})
})


app.listen(process.env.Port,async ()=>{
    try {
        await connection
        console.log("Connected to Db")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`Running at ${process.env.Port}`)
})
