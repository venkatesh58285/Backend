import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.models.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyJwt = asyncHandler(async(req,_,next)=>{
    // console.log(req.cookies);
    const token = req.cookies?.accessToken||req.header('Authorization')?.replace('Bearer ','');
    if(!token) throw new ApiError(401,'Token not found unauthorized')
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN);
    // console.log(decoded);
    //if decoded find it in model and create a new req key as user
    const user = await User.findById(decoded?._id).select('-password -refreshToken');
    if(!user) throw new ApiError(404,"User not found to proceed auth");

    req.user = user;
    next();
})


export {verifyJwt};