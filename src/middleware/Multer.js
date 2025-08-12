import  multer from 'multer'
import fs from 'fs';


export const genralExtintiion={
  image:["image/png","image/jpg"],
  video:["audio/mpeg", "video/mp4"]

}
export const MulterLocal=({custompath="genrals",genralExtintiion=[]})=>{
    const fullpath=`uploads/${custompath}`
    if(!fs.existsSync(fullpath)){
        fs.mkdirSync(fullpath,{recursive:true})
    }
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fullpath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
function filefilter(req,file,cb){
if(!genralExtintiion.includes(file.mimetype)){
  cb("inValid file")
}else{
  cb(null,true)
}
}

const upload = multer({ storage: storage ,filefilter})
return upload
}

export const MulterHost=({genralExtintiion=[]}={})=>{
   
const storage = multer.diskStorage({ })
function fileFilter(req,file,cb){
if(!genralExtintiion.includes(file.mimetype)){
  cb("inValid file")
}else{
  cb(null,true)
}
}
const upload = multer({ storage: storage ,fileFilter})
return upload
}