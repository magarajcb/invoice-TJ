const express=require("express")
const app=express()
app.get("/",(req,res)=>{
    res.json({
        message:"Server started"
    })
})
app.listen(3001,(error)=>{
    if(error){
        console.log("Failed to start the server",error.message)
        return
    }
    console.log("Server started")
})