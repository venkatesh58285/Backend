import multer from 'multer' //for file uploading express don't have file uploading features
//no need of calling next() rather it's a middleware it internally processes all the things
const storage = multer.diskStorage({      //methods of storage .single('fieldname')  .array(fieldname,count)
    destination:function(req,file,cb){    //destination and filename need to be functions in diskStorage
        cb(null,'./public/temp')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname) //methods inside file originalname fieldname filename etc..
    }
})
export const uploads = multer({
    storage
});