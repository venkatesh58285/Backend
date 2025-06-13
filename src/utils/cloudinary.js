import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

//main thing need to do is upload to cloudinary via cloudinary.uploader.upload(path)

cloudinary.config({  //cloudinary configurations
    cloud_name:'venkatesh1',
    api_key:`${process.env.COUDINARY_API_KEY}`,
    api_secret:`${process.env.CLOUDINARY_API_SECRET}`
})

const uploadCloudinary=async function(localPath){
    try{
        if(!localPath) return null;
        const response = await cloudinary.uploader.upload(localPath,{
        resource_type:"auto"
    });
    fs.unlinkSync(localPath);
    //  console.log(response);  //gives url original_filename format resource_type 
    return response;
    }
    catch(err){
        fs.unlinkSync(localPath);
        console.log("error in cloudinary ",err);
        return null;
    }
}
export {uploadCloudinary};