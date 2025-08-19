import connectionDB from "./DB/connectionDB.js"
import { globalErrorHandling } from "./middleware/globalHandling.js"

import cors from 'cors'
import userRouter from "./moduls/User/user.controller.js"
import MessageRouter from "./moduls/Message/Message.controller.js";

var whitelist = [process.env.ORGIN_URLFRONT];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

const bootstrap=(app,express)=>{
    app.use(cors(corsOptions))
 
    app.use(express.json())
    
    connectionDB()

  app.get("/", (req, res) => {
  res.send("Welcome to app..............✌️💙");
});
    app.use("/uploads",express.static("uploads"))
    app.use("/users",userRouter)
    app.use("/Message",MessageRouter)
    

    app.use(globalErrorHandling)
}


export default bootstrap