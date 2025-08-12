import joi from "joi";
import genralRoles from "../../../utilts/genralRoles.js";
import { userRole } from "../../DB/models/user.model.js";


export const userSignUP = {
  body: joi.object({
    name: genralRoles.name.required(),
    email: genralRoles.email.required(),
    password: genralRoles.password.required(),
    cpassword: joi.valid(joi.ref("password")).required().messages({
      "any.only": "Confirm password must match password"
    }),
    phone: genralRoles.phone.required(),
    age: genralRoles.age.required(),
    Role: joi.string().valid(...Object.values(userRole)).required()
  }),
  file:genralRoles.file.required()
  // files:joi.array().items(genralRoles.files.required()).required()
};

export const updatepasswordSchema={
  body: joi.object({
   oldpassword: genralRoles.password.required(),
   newpassword: genralRoles.password.required(),
    cpassword: joi.valid(joi.ref("newpassword")).required().messages({
       "any.only": "Confirm password must match new password",
    "any.required": "Confirm password is required"
    })
  })
}
export const forgetpasswordSchema ={
  body: joi.object({
    email: genralRoles.email.required(),
  })
}
export const resetpasswordSchema ={
  body: joi.object({
    email: genralRoles.email.required(),
     newpassword: genralRoles.password.required(),
    cpassword: joi.valid(joi.ref("newpassword")).required().messages({
       "any.only": "Confirm password must match new password",
    "any.required": "Confirm password is required"
    }),
    otp:joi.string().required().length(5)
  })
}

export const updateProfileSchema = {
  body: joi.object({
    name: genralRoles.name,
    email: genralRoles.email,
    phone: genralRoles.phone,
    age: genralRoles.age
 
  })
};

export const FreezeProfileSchema = {
  params: joi.object({
    id: joi.string().length(24).hex().optional().messages({
      "string.base": "ID must be a string",
      "string.length": "ID must be exactly 24 characters",
      "string.hex": "ID must be a valid hexadecimal string",
      "any.required": "ID is required"
    })
  })
};

export const updateProfileImageSchema ={
 file:genralRoles.file.required()
}