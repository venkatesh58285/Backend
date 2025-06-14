import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {Subscription} from '../models/subscription.model.js';

const SubscribeToChannel = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const channelId = req.params.channelId;
    if(String(userId) == String(channelId)) throw new ApiError(400,'Subscribe to own channel is prohibited')
    if(!channelId) throw new ApiError(400,'Channel not found')
    const info = await Subscription.findOne({subscriber:userId,owner:channelId})
    if(info) throw new ApiError(400,"Already subscibed")
    const details = await Subscription.create({subscriber:userId,owner:channelId})
    return res
    .status(200)
    .json(
        new ApiResponse(200,details,"Suscribed")
    )
})

const UnSubscribeToChannel = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const channelId = req.params.channelId;
    if(!channelId) throw new ApiError(400,'Channel not found')
    const info = await Subscription.findOne({subscriber:userId,owner:channelId})
    if(!info) throw new ApiError(400,"Not subscibed")
    const deleted = await Subscription.findOneAndDelete({subscriber:userId,owner:channelId})
    if(!deleted) throw new ApiError(404,"unable to delete")
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"UnSuscribed")
    )
}) 

const getChannelSubscribers = asyncHandler(async(req,res)=>{
    const user = req.user._id;
    // const subscribers = Subscription.find({user}).populate("subscriber","username email");
    // if(!subscribers?.length) throw new ApiError(404,"User not found")
    const pipelines = Subscription.aggregate([
        {
            $match: {
                channel:user
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribers"
            }
        },
        {
            $project:{
                username:1,
                fullName:1,
                email:1,
            }
        }
    ])
    if(!pipelines?.length){
        throw new ApiError(400,'Subscribers not found')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,pipelines,"Got all subscribers")
    )

})

const getChannelsSubscribedTo = asyncHandler(async(req,res)=>{
     const user = req.user._id;
     const pipelines = Subscription.aggregate([
        {
            $match: {
                subscriber:user
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedTo"
            }
        },
        {
            project:{
                username:1,
                fullName:1,
                email:1,
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(200,pipelines,"Got all subscribers")
    )

})

export {
    SubscribeToChannel,
    UnSubscribeToChannel,
    getChannelSubscribers,
    getChannelsSubscribedTo
}