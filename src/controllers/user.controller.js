import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend
  const { fullName, username, email, password } = req.body;

  // validation - (not empty)
  if (
    [fullName, username, email, password].some((feild) => feild?.trim() === "")
  ) {
    throw new ApiError(400, "registerUser :: All Feilds are Required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findById({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "registerUser :: User with email or username already exists"
    );
  }

  // check for images, check for avatar(compulsory)
  const avatarLocalPath = req.files?.avatar[0]?.path; // file access through multer

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "registerUser :: Avatar is required");
  }

  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");
  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "coverImage"
  );

  if (!avatar) {
    throw new ApiError(
      400,
      "registerUser :: Error uploading avatar to cloudinary"
    );
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(
      500,
      "registerUser :: Something went wrong while creating user"
    );
  }

  // return response
  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User Created Sucessfully"));
});

export { registerUser };
