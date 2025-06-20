import mongoose from 'mongoose';

const playlistSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timastamps:true})

export const Playlist = mongoose.model('Playlist',playlistSchema)