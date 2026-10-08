const express=require("express")
const app=express()
const customerRoutes = require("./src/modules/customer/customer.routes");
app.use(express.json());
app.get("/",(req,res)=>{
   res.json({message:"Server started"})
})
// app.post("/user",(req,res)=>{
//     res.json({message:"Hello user"})
// })
// app.delete("/user:id",(req,res)=>{
// res.json({message:"User deleted"})
// })
app.use("/api/customers",customerRoutes)
module.exports=app;