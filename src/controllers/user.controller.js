import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async(req,res)=>{
   //get user detail from frontend
   //Validation-not empty
   //check if user already exists: useername or email
   //check for images, check for avatar
   // upload them to cloudinary,avatar
    //create a user object- create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    const{fullName,email, username,password}=req.body
    console.log(email)

    // if(fullName==""){
    //     throw new ApiError(400,"fullName is required")
    // }
    if(
        [fullName,email,username,password].some((field)=>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All Fields are required")
    }

    const existedUser =await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw  new ApiError(409,"User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    const cover = await uploadOnCloudinary(coverLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar files is required")
    }

    User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the User");
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User Register Successfully")
   )
})

export {registerUser}