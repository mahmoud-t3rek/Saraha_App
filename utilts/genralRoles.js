
import joi from "joi";

const customId = (value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.message("Invalid user ID format");
  }
  return value;
};



 const generalRules = {
 Id: joi.string().required().custom(customId),
  email: joi.string().email({ tlds: { allow: false } }),
  password: joi.string().min(6).max(30),
  name: joi.string().min(3).max(30).alphanum(),
  age: joi.number().min(18).max(60),
  phone: joi.string().pattern(/^01[0125][0-9]{8}$/), 
  headerd:joi.object({
    authorization: joi.string().required(),
  }).unknown,
  file:joi.object({
         size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
      }).unknown(true).messages({
        "any.required":"file is requirad"
      })
};
export default generalRules