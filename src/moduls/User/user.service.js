import userModel, { userProvide, userRole } from "../../DB/models/user.model.js";
import bcrypt from "bcrypt"
import crypto from "crypto-js"
import jwt, { decode } from 'jsonwebtoken';
import { cloudinary, createToken } from '../../../utilts/index.js';
import {nanoid,customAlphabet} from 'nanoid'
import revokeTokenModel from "../../DB/models/revokeToken.js";
import { EventEmitter } from "../../sendemailEvent.js/index.js";
import {OAuth2Client} from "google-auth-library"


//===================signUp================================
export const signUp=async(req,res,next)=>{
const {name,email,password,cpassword,phone,age,Role}=req.body;
if(!req?.file){
  throw new Error("file is requirad",{cause:400})      
}

const finduser=await userModel.findOne({email});
console.log(finduser);

if(finduser){
    throw new Error("Email is already Exist!",{cause:409});
}
const hashPassword=bcrypt.hashSync(password,Number(process.env.SALT_ROUNTS))
const encryptphone=crypto.AES.encrypt(phone,process.env.SECRET_KEY).toString();
EventEmitter.emit("sendemail",{email})
const {public_id,secure_url}=await cloudinary.uploader.upload(req?.file?.path)


const user=await userModel.create({
  name,
  email,
  password:hashPassword,
  phone:encryptphone,
  age,
  role:Role,
  ProfileImage:{public_id,secure_url}
})
if(!user){
    throw new Error("faild SignUp",{cause:400})
}

res.status(200).json({message:"Success",user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    age: user.age, 
    role: user.role,
    ProfileImage:{public_id,secure_url}
  }})}
//=======================confirmemail=========================
export const confirmEmail=async(req,res,next)=>{
 const {token}=req.params
 const decoded = jwt.verify(token, process.env.SEND_EMAILTOKEN);
 const email = decoded.email;
const finduser=await userModel.findOne({email});
if(!finduser){
    throw new Error("User not found!",{cause:409});
}
finduser.confirmed=true;
await finduser.save();
res.status(200).json({message:"confirmed Success"})
}
//=====================logIn================================
export const logIn=async(req,res,next)=>{
const {email,password}=req.body
const findUser=await userModel.findOne({email,confirmed:true})
 if (!findUser || !(await bcrypt.compare(password, findUser.password))) {
    throw new Error("Invalid email or password", { cause: 409 });
  }
const isUser = findUser.role === userRole.user;

const accesstoken = await createToken(
  { id: findUser.id, email,type: 'access'  },
  isUser ? process.env.ACCSESS_TOKENUSER : process.env.ACCSESS_TOKENADMIN,
  { expiresIn: 60*60,jwtid:nanoid() }
);

const refreshToken = await createToken(
  { id: findUser.id, email,type: 'refresh'  },
  isUser ? process.env.REFRESCH_TOKENUSER : process.env.REFRESCH_TOKENADMIN,
  { expiresIn: "1y" ,jwtid:nanoid()}
);

res.status(200).json({message:"confirmed Success",accesstoken,refreshToken})
}
//======================getprofile==========================

export const getprofile=async(req,res,next)=>{
const bytes  = crypto.AES.decrypt(req.user.phone,process.env.SECRET_KEY );
const originalText = bytes.toString(crypto .enc.Utf8);

req.user.phone=originalText
res.status(200).json({message:"Success",user:req.user})
}

//===================logout======================
export const logout=async(req,res,next)=>{

  const user=await revokeTokenModel.create({
    tokenId:req.decoded.jti,
    expireAt: new Date(req.decoded.exp * 1000)
  })
  if(!user){
    throw new Error("faild log out!",{cause:"404"})
  }
res.status(200).json({message:"log out success"})
}
//========================refreshToken================================
export const refreshToken=async(req,res,next)=>{
const findUser=req.User
const decoded=req.decoded
const email=decoded.email

const accesstoken = await createToken(
  { id: findUser.id, email,type: 'access'  },
   req.prefix === "admin" ? process.env.ACCSESS_TOKENADMIN:process.env.ACCSESS_TOKENUSER ,
  { expiresIn: "1d",jwtid:nanoid() }
);

const refreshToken = await createToken(
  { id: findUser.id, email,type: 'refresh'  },
   req.prefix === "admin"?process.env.REFRESCH_TOKENADMIN:process.env.REFRESCH_TOKENUSER ,
  { expiresIn: "1y" ,jwtid:nanoid()}
);
  res.status(200).json({message:"success",accesstoken,refreshToken})
}
//=========================updatePassword================
export const updatePassword=async(req,res,next)=>{
  const {oldpassword,newpassword,cpassword}=req.body
  if(newpassword !== cpassword){
    throw new Error("the confirm password not match",{cause:400})
  }
   const user = req.user;
   const match = await bcrypt.compare(oldpassword, user.password);  
    if (!match) {
      throw new Error("Your old password is incorrect", { cause: 400 });
    }
const hashPassword = await bcrypt.hash(newpassword, Number(process.env.SALT_ROUNDS)); 
  const update_password=await userModel.updateOne({ _id: user._id },{password:hashPassword})
  if(!update_password.modifiedCount){
     throw new Error("faild update password",{cause:400})
  }
 
  res.status(200).json({message:"Password updated successfully"})
}
//=====================forgetpassword=============
export const forgetpassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Email does not exist", { cause: 400 });
    }

    const generateOtp = customAlphabet("123456789abcde", 5);
    const otp = generateOtp();
    EventEmitter.emit("forgetpassword", { email, otp, name: user.name });

    user.otpExpires = new Date(Date.now() + 1000 * 60 * 1);
    const hash=bcrypt.hashSync(otp,Number(process.env.SALT_ROUNDS))
    user.otp=hash
    await  user.save()
    res.status(200).json({ message: "Success, OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};
//===============resetpassword============
export const resetpassword = async (req, res, next) => {
  try {
    const { email,newpassword,cpassword,otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("This email is not registered.", { cause: 400 });
    }

    if (Date.now() > user.otpExpires) {
  throw new Error("This code has expired, please request a new one.", { cause: 400 });
}
  const match=await bcrypt.compare(otp,user.otp)
    if(!match){
      throw new Error("Invalid code. Please check and try again.")
    }
 
    if(newpassword!==cpassword){
      throw new Error("Password confirmation does not match.",{cause:400})
    }
   const hash = await bcrypt.hash(newpassword, Number(process.env.SALT_ROUNDS));
   const update_password=await userModel.updateOne({email},{
      password:hash,
      $unset: { otp: "", otpExpires: "" }
})
   if (update_password.modifiedCount === 0) {
  throw new Error("Failed to update password", { cause: 400 });
}
 res.status(200).json({ message: "Success, your password was updated" });
   
  } catch (error) {
    next(error);
  }
};
//=================Updateprofile===============================

export const updateProfile = async (req, res, next) => {
  try {
    const { email,name,phone,age } = req.body;
    if(phone){
      const encryptphone=crypto.AES.encrypt(phone,process.env.SECRET_KEY).toString();
      req.user.phone=encryptphone
    }
    if(name){
      req.user.name=name
    }
    if(age){
      req.user.age=age
    }
    if(email){
      const user=await userModel.findOne({email})
      if(!user){
        throw new Error("email is already exist",{cause:400});  
      }
      EventEmitter.emit("sendemail",{email})
      req.user.email=email
      req.user,confirmed=false
    }
    
    await req.user.save()
   
 res.status(200).json({ message: "Success, your password was updated" });
   
  } catch (error) {
    next(error);
  }
};
//============================loginWithGmail=====================
export const loginWithGmail = async (req, res, next) => {
  try {
    const {idToken}=req.body
   
const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID, 
      
  });
  const payload = ticket.getPayload();
  return payload
  
}
const {email,name,email_verified}=await verify()
let user=await userModel.findOne({email});
if(!user){
  user=await userModel.create({
 email,
  name,
confirmed:email_verified,
provider:userProvide.google

  })
 return res.status(200).json({ message: "Success, account created with Google", user });

}
 throw new Error("Account already exists. Please login using email and password.");
   
  } catch (error) {
    next(error);
  }
};
//=========================freezeProfile==============
export const freezeProfile = async (req, res, next) => {
  const id = req.params.id || req.user._id;

  
  if (req.user._id.toString() !== id && req.user.Role !== "admin") {
    return next(new Error("Not authorized to freeze this profile", { cause: 403 }));
  }

  const user = await userModel.updateOne(
    { _id: id, isDeleted: { $exists: false } },
    { isDeleted: true, deletedBy: req.user._id }
  );

  return user.matchedCount
    ? res.status(200).json({ message: "Account has been frozen successfully" })
    : res.status(404).json({ message: "Fail to freeze" });
};
//==========================unfreeze========================
export const unfreezeProfile = async (req, res, next) => {
  const id = req.params.id || req.user._id;

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return next(new Error("Not authorized to unfreeze this profile", { cause: 403 }));
  }

  const user = await userModel.updateOne(
    { _id: id, isDeleted: { $exists: true } },
    {
      $unset: { deletedBy: "", isDeleted: "" }
    }
  );

  return user.matchedCount
    ? res.status(200).json({ message: "Account has been unfrozen successfully" })
    : res.status(404).json({ message: "Fail to unfreeze" });
};

//====================updateProfileImage===========================
export const updateProfileImage = async (req, res, next) => {
  const {public_id,secure_url}=await cloudinary.uploader.upload(req?.file?.path)



  const user = await userModel.findByIdAndUpdate({_id:req?.user?._id},{ProfileImage:{public_id,secure_url}},{new:true})
    await cloudinary.uploader.destroy(user?.ProfileImage?.public_id)

  res.status(200).json({ message: "Update photo success" ,user})
    
};


//====================deleteuser============================

export const deleteUser = async (req, res, next) => {
  const userId = req?.user?._id;

  const user = await userModel.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await cloudinary.api.delete_resources_by_prefix(`sarahapp/users/coverImages/${userId}`);
  await cloudinary.api.delete_folder(`sarahapp/users/coverImages/${userId}`);

  res.status(200).json({ message: "User deleted" });
};
