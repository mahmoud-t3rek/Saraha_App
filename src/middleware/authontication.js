import userModel from "../DB/models/user.model.js";
import { varifyToken } from "../../utilts/Token/varfiyToken.js";
import revokeTokenModel from "../DB/models/revokeToken.js";

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Token not found", { cause: 400 });
    }

    const [prefix, token] = authorization.split(" ");
    if (!prefix || !token) {
      throw new Error("Invalid Authorization header format", { cause: 409 });
    }

    let signature = "";
    const lowerPrefix = prefix.toLowerCase();

    if (lowerPrefix === "bearer") {
      signature = process.env.ACCSESS_TOKENUSER;
    } else if (lowerPrefix === "admin") {
      signature = process.env.ACCSESS_TOKENADMIN;
    } else {
      throw new Error("Prefix must be Bearer or Admin", { cause: 401 });
    }

    const decoded = await varifyToken(token, signature);
    if (!decoded || !decoded.email) {
      throw new Error("Invalid token payload", { cause: 401 });
    }

    const foundUser = await userModel.findOne({ email: decoded.email });
    if (!foundUser) {
      throw new Error("User not found", { cause: 409 });
    }
    const revoketoken=await revokeTokenModel.findOne({tokenId:decoded.jti})
      if (revoketoken) {
      throw new Error("please login again", { cause: 409 });
    }
    if(!foundUser?.confirmed ||foundUser?.isDeleted==false){
        throw new Error("please confirm your email first",{cause:404})
    }

    req.decoded = decoded;
    req.user = foundUser;
    next();
  } catch (error) {
    next(error);
  }
};


export const refresh_Token=async(req,res,next)=>{
  try {
    
   const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Token not found", { cause: 400 });
    }

    const [prefix, token] = authorization.split(" ");
    if (!prefix || !token) {
      throw new Error("Invalid Authorization header format", { cause: 409 });
    }

    let signature = "";
    const lowerPrefix = prefix.toLowerCase();

    if (lowerPrefix === "bearer") {
      signature = process.env.REFRESCH_TOKENUSER;
    } else if (lowerPrefix === "admin") {
      signature = process.env.REFRESCH_TOKENADMIN;
    } else {
      throw new Error("Prefix must be Bearer or Admin", { cause: 401 });
    }

    const decoded = await varifyToken(token, signature);
    if (!decoded || !decoded.email) {
      throw new Error("Invalid token payload", { cause: 401 });
    }
    const revoketoken=await revokeTokenModel.findOne({tokenId:decoded.jti})
      if (revoketoken) {
      throw new Error("please login again", { cause: 409 });
    }
    const foundUser = await userModel.findOne({ email: decoded.email });
    if (!foundUser) {
      throw new Error("User not found", { cause: 409 });
    }
    req.User=foundUser
    req.decoded=decoded 
     req.prefix = lowerPrefix;
    next();
     } catch (error) {
    next(error);
  }
    
}