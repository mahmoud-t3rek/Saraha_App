import Router  from "express";
import { forgetpasswordSchema, FreezeProfileSchema, resetpasswordSchema, updatepasswordSchema, updateProfileImageSchema, updateProfileSchema, userSignUP } from "./userValidation.js";
import * as UC from "./user.service.js";
import validtion from "../../middleware/Valdition.js";
import { authentication, refresh_Token } from "../../middleware/authontication.js";
import { genralExtintiion, MulterHost } from "../../middleware/Multer.js";
import validation from "../../middleware/Valdition.js";
import limiter from "../../middleware/rateLimit.js";


const userRouter=Router()
userRouter.post(
  "/signUp",
  MulterHost({
    custompath: "file",
    genralExtintiion: genralExtintiion.image
}).single("image"), validation(userSignUP), UC.signUp
);

userRouter.get("/confirmed/:token", UC.confirmEmail)
userRouter.post("/logIn",limiter, UC.logIn)
userRouter.post("/loginWithGmail", UC.loginWithGmail)
userRouter.get("/getprofile",authentication, UC.getprofile)
userRouter.post("/logout",authentication, UC.logout)
userRouter.post("/refreshToken",refresh_Token, UC.refreshToken)
userRouter.patch("/updatePassword",validtion(updatepasswordSchema),authentication, UC.updatePassword)
userRouter.patch("/updateProfileImage",authentication,  MulterHost({
    custompath: "file",
    genralExtintiion: genralExtintiion.image
}).single("image"),validtion(updateProfileImageSchema), UC.updateProfileImage)
userRouter.post("/forgetpassword",limiter,validtion(forgetpasswordSchema), UC.forgetpassword)
userRouter.patch("/resetpassword",validtion(resetpasswordSchema), UC.resetpassword)
userRouter.patch("/updateProfile",validtion(updateProfileSchema), UC.updateProfile)
userRouter.delete("/freezeProfile/{:id}",validtion(FreezeProfileSchema),authentication, UC.freezeProfile)
userRouter.delete("/unfreezeProfile/{:id}",validtion(FreezeProfileSchema),authentication, UC.unfreezeProfile)
userRouter.delete("/deleteUser",authentication, UC.deleteUser)




export default userRouter