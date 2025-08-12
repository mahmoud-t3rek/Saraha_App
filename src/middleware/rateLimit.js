import rateLimit from "express-rate-limit"

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	limit: 6,
	handler:(req,res,next,options)=>{
        res.status(429).json({
            error:  `Too many requests from this IP. Try again after ${options.windowMs / 1000} seconds.`
        })
    },
    skipSuccessfulRequests:true
})


export default limiter