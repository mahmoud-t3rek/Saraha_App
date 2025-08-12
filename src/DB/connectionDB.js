import mongoose from "mongoose";
const connectionDB=()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("connect success.....................✌❤");
    }).catch(()=>{
         console.log("faildconnect");
    })
}

export default connectionDB