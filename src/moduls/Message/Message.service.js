import messageModel from "../../DB/models/message.model.js"
import userModel from "../../DB/models/user.model.js"

export const sendMessage=async(req,res,next)=>{
   const { content, UserId } = req.body;
   const findUser = await userModel.findOne({
    _id: UserId,
    isDeleted: { $exists: false }
  });

  if (!findUser) {
    throw new Error("User is not exist or freeze", { cause: 404 });
  }

   const message = await messageModel.create({
  userId: UserId,
  content
})

    if(!message){
        throw new Error("faild send",{cause:400});
    }
    res.status(200).json({message:"send success",data:message})
     
}
///=================getMessage===================
export const getMessage=async(req,res,next)=>{
   
  const finduser=await messageModel.find({userId:req?.user?._id})
  if(!finduser){
    throw new Error("user is not exist or freeze",{cause:400})
  }

    res.status(200).json({message:"done",data:finduser})
     
}
//==============getonemessage=======================
export const getOneMessage=async(req,res,next)=>{
   const {Id}=req.params
  const finduser=await messageModel.findOne({userId:req?.user?._id,_id:Id})
  if(!finduser){
    throw new Error("message not found",{cause:400})
  }

    res.status(200).json({message:finduser.content})
     
}