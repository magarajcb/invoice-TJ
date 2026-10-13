const app=require('./app')
const connectDB = require('./src/config/db')
require("dotenv").config()
const PORT=process.env.PORT || 3000
connectDB()
app.listen(5000,(error)=>{
    if(error){
        console.log("failed to start the server")
        return
    }
    console.log("Server started")
})