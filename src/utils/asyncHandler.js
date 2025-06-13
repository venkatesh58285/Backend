//used mainly instead of writing try catch block evertime it's like a higher order function
 const asyncHandler=(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler};