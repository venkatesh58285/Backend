import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'; //debug
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
app.use(cookieParser());
// app.use(cors()); //alow all
// var whitelist = ['http://localhost:5000', 'http://example2.com']
// var corsOptions = {
//     origin:function(origin,callback){
//         if(!origin || whitelist.includes(origin)){
//             callback(null,true)
//         }
//         else{
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }
app.use(cors());
app.get('/',(req,res)=>{
   res.send("working");
})

import router1 from "./routes/user.route.js";
import router2 from "./routes/subscription.route.js";

app.use('/api/v1/users',router1);
app.use('/api/v1/subscriptions',router2);




export {app};