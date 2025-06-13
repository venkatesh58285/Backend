import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';

export const Connection=async()=>{
    try{
        const Status = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        // console.log(`Connected Succesfully ${Status.connection.host}`)
    }catch(error){
        console.log("Failed to coonect to db ",error);
        process.exit(1);
    }
}