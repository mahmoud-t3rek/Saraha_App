
import mongoose from "mongoose";


export let userRole = {
  admin: "admin",
  user: "user"
};

export let userProvide = {
  system: "system",
  google: "google"
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 18,
    min: 5
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function () {
      return this.provide === userProvide.system;
    }
  },
  phone: {
    type: String,
    required: function () {
      return this.provide === userProvide.system;
    }
  },
  ProfileImage:{
    public_id:{ type: String},
      secure_url:{ type: String}
  },
  coverImage:[String],
  age: {
    type: Number,
    required: function () {
      return this.provide === userProvide.system;
    },
    min: [18, "age must greater than 18"],
    max: [60, "age must smaller than 60"]
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(userRole)
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  provide: {
    type: String,
    enum: Object.values(userProvide),
    default: userProvide.system
  },
  isDeleted:Boolean,
 
  deletedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
}, {
  timestamps: true
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
