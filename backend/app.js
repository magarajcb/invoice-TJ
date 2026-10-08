const express=require("express")
const app=express()
app.get("/",(req,res)=>{
   res.json({message:"Server started"})
})
app.post("/user",(req,res)=>{
    res.json({message:"Hello user"})
})
app.delete("/user:id",(req,res)=>{
res.json({message:"User deleted"})
})
module.exports=app;