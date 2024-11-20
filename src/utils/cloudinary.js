import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath)
            return null;
        //upload on cloudinary
       const res= await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //FIle has been uploaded successfully 
        console.log("File upload Successfully",res.colors);
        return res;
    } catch (err) {
        fs.unlinkSync(localFilePath)//remove the locally saved temp file as the upload operation has failed
    }
}


// cloudinary.v2.uploader.upload("/home/my_image.jpg", {upload_preset: "my_preset"}, (error, result)=>{
//     console.log(result, error);
//   });

export {uploadOnCloudinary}