

export const Authorization=(accessRole)=>{
    return (req,res,next)=>{
        if(!accessRole.includes(req?.user?.role)){
          throw new Error("user not Authorization",{cause:400});
          
        }
        return next()
    }
}