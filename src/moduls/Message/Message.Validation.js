import joi from "joi"
import generalRules from "../../../utilts/genralRoles.js";

export const SendMessageSchema = {
  body: joi.object({
    content: joi.string().min(1).max(500).required(),
    UserId: generalRules.Id.required()
  }).required()
};

export const GetMessageSchema = {
  params: joi.object({
    Id: generalRules.Id.required()
  }).required()
};
