const mongoose=require("mongoose")
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo connected")
    }
    catch(error){
        console.log("failed to connect",error.message)
        process.exit(1)
    }
}
module.exports=connectDB;