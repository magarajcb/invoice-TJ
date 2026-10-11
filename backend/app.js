const express=require("express")
const app=express()
const customerRoutes = require("./src/modules/customer/customer.routes");
const productRoutes = require("./src/modules/product/product.routes");
const invoiceRoutes = require("./src/modules/invoice/invoice.routes");
const dashboardRoutes = require("./src/modules/dashboard/dashboard.routes");
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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers",customerRoutes)
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);

module.exports=app;