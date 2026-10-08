const app=require('./app')
const connectDB = require('./src/config/db')
require("dotenv").config()
const PORT=process.env.PORT || 3001
connectDB()
app.listen(3001,(error)=>{
    if(error){
        console.log("failed to start the server")
        return
    }
    console.log("Server started")
})