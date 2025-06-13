import mongoose from 'mongoose';
import {asyncHandler} from '../utils/asyncHandler.js';
import {uploads} from '../middlewares/multer.middleware.js';
import {uploadCloudinary} from '../utils/cloudinary.js';
import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken';

const options={    //this options enables only server can change tokens but client cant modify them
      httpOnly:true,
      secure:true
   }

const generateToken =async(userId)=>{
  try{
    const user = await User.findById(userId);
   if(!user){
      throw new ApiError(404,"User not found to send refreshToken");
   }
   const accessToken =  user.generateAccessToken();
   const refreshToken =  user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save({validateBeforeSave:false})
   return {accessToken,refreshToken};
  }
  catch(err){
   throw new ApiError(500,'internal server error');
  }
}

const RegisterUser = asyncHandler(async (req,res)=>{
   //get user details from frontend
   //check if all fields are entered validation
   //check if user is already logged in
   //use cloudinary for uploading avatar coverImage
   //create user object and also send data into database using create
   //remove password and refreshToken from object and send response
   //return response

   const {username,email,fullName,password} = req.body;
   //  console.log(req.body);
   if([username,email,fullName,password].some((field)=>field?.trim() === "")){
    throw new ApiError(400,"All fileds are required");
   }

   const logged =await User.findOne({
    $or : [{email},{username}]
   })
   if(logged){
    throw new ApiError(409,"Already registered");
   }

   const avatarPath = req.files?.avatar[0]?.path;   //as multer middleware is included new methods get enabled
//    const coverImagePath = req.files?.coverImage[0]?.path;
   // console.log(req.files); got fieldname filename path originalname 
   let coverImagePath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImagePath = req.files.coverImage[0].path;
   }
   if(!avatarPath){
    throw new ApiError(400,"Avatar is required");
   }

   const avatar =await uploadCloudinary(avatarPath);    //got url format resource_type height width original_filename
   const coverImage = await uploadCloudinary(coverImagePath);   //d2
   if(!avatar){
    throw new ApiError(400,"Avatar is required");
   }

   const user =await User.create({
    username,
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url||" ",
    password
   })
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   );
   if(!createdUser){
    throw new ApiError(500,"User not Registered internal server error");
   }
   
   return res.status(200).json(
    new ApiResponse(202,"Registered Successfully")
   )
   
})

const LoginUser = asyncHandler(async (req,res)=>{
   //get data from frontend
   //validation
   //matches first email and then password
   //access and refresh token send to fe through cookies res.cookie(name,val,options)
   //return response
   const {email,password} = req.body;
   
   if(!email){
      throw new ApiError(400,"Email is required");
   }

   const user = await User.findOne({email});
   if(!user){
      throw new ApiError(404,"User not found");
   }
   const isPasswordValid =await user.isPasswordCorrect(password);
   if(!isPasswordValid){
      throw new ApiError(401,"invalid credentials");
   }
   
   const {refreshToken,accessToken} = await generateToken(user._id);
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   return res
   .status(200)
   .cookie('accessToken',accessToken,options)
   .cookie('refreshToken',refreshToken,options)
   .json(
      new ApiResponse(200,
       {user:loggedInUser,
       refreshToken,
       accessToken},
       "user logged in successfully"
      )
   );
})


const LogoutUser = asyncHandler(async(req,res)=>{
   //remove refreshTOken from db
   //send res
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const generateNewRefreshToken = asyncHandler(async(req,res)=>{
   //get refresh token from cookie
   //find user and set new refreshToken in db through generateToken
   //send response to client
   const token = req.cookies?.refreshToken;
   if(!token) throw new ApiError(401,'Unauthorized');
   const decoded = jwt.verify(token,process.env.REFRESH_TOKEN);
   // console.log(decoded);
   const user =await User.findById(decoded._id);
   if(!user) throw new ApiError(404,"invalid credentials user not found");

   if(user.refreshToken != token) throw new ApiError(401,'Unauthorized');

   const {refreshToken,accessToken} =await generateToken(user._id);  //d await
   console.log(refreshToken);
   return res
   .status(200)
   .cookie('accessToken',accessToken,options)
   .cookie('refreshToken',refreshToken,options)
   .json(new ApiResponse(
      200,
      {refreshToken,accessToken},
      "Access Token refreshed"
   ))
})




export {
   RegisterUser,
   LoginUser,
   LogoutUser,
   generateNewRefreshToken
};