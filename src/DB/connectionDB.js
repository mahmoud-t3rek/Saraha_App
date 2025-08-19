import mongoose from "mongoose";
const connectionDB=()=>{
    
    mongoose.connect(process.env.DB_URL_ONLINE).then(()=>{
        console.log("connect success.....................✌❤");
    }).catch((Error)=>{
         console.log("faildconnect",Error);
    })
}

export default connectionDB         