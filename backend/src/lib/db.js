import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(ENV.MONGO_URI, {dbName:"chatify"});
        console.log("mongodb connected : ", conn.connection.host);
    }
    catch(err){
        console.error("error connecting mongodb: ", err);
        process.exit(1) ; //1 status code means fail
    }
    
}