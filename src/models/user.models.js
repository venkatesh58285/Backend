import dotenv from 'dotenv';
import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  


dotenv.config();


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
) 



//document middleware in mongoose
userSchema.pre("save",async function(next){      
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    // console.log("Hashed the passdword ",this.password);
       next();
})


//custom methods
userSchema.methods.isPasswordCorrect = async function (password){    
    return await bcrypt.compare(password,this.password);
}

//jwt syntax: jwt.sign(payload,secretkey,{expiresIn})
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username: this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN,
    {
        expiresIn:process.env.ACESS_TOKEN_EXPIRY,

    }
)
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
    {
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,

    }
)
}

export const User = mongoose.model("User",userSchema);