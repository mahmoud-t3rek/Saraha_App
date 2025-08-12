import { Router } from "express";
import * as  MS from "./Message.service.js"
import validation from "../../middleware/Valdition.js";
import * as MV from "./Message.Validation.js";
import { authentication } from "../../middleware/authontication.js";
const MessageRouter=Router({caseSensitive:true,strict:true,mergeParams:true})

MessageRouter.post("/send",validation(MV.SendMessageSchema),MS.sendMessage)
MessageRouter.get("/",authentication,MS.getMessage)
MessageRouter.get("/:Id",validation(MV.GetMessageSchema),authentication,MS.getOneMessage)


export default MessageRouter