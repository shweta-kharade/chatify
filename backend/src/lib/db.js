import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {dbName:"chatify"});
        console.log("mongodb connected : ", conn.connection.host);
    }
    catch(err){
        console.error("error connecting mongodb: ", err);
        process.exit(1) ; //1 status code means fail
    }
    
}