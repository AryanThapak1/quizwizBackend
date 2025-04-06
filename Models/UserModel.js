const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Credential must have a password"],
    unique:true
  },
  password: {
    type: String,
    required: [true, "Crendentials must have a password"],
  },
  firstname: {
    type: String,
    required: [true, "Credentials must have a first name"],
  },
  lastname: {
    type: String,
    required: [true, "Credentials must have a last name"],
  },
  college:{
    type:String,
    required:[true, "Credentials must have a college"]
  },
  branch:{
    type:String,
  },
  course:{
    type:String
  },
  role:{
    type:String,
    enum:["Student","Teacher"]
  }
});

credentialsSchema.pre("save",async function(){
    this.password=await bcrypt.hash(this.password,12);
})

credentialsSchema.methods.comparePassword=async function(candidatePassword,orignalPassword){
    isAuthenticated=await bcrypt.compare(candidatePassword,orignalPassword);
    return isAuthenticated;
}

const userModel=mongoose.model("User",credentialsSchema);

module.exports=userModel