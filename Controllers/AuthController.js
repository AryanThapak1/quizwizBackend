const User=require("./../Models/UserModel.js")
const jwt=require("jsonwebtoken");

const tokenGenerator=async(payload)=>{
    return new Promise((resolve,reject)=>{
        try{
            const token=jwt.sign(payload,process.env.JWT_Secret)
            resolve(token);
        }
        catch(err){
            reject(err);
        }
    })
}
exports.signup=async (req,res,next)=>{
    const existingUser=await User.findOne({email:req.body.email});
    console.log(req.body)
    if(existingUser){
      return res.status(400).json({
        status:"Failed",
        message:"User already Exists"
      })
    }
    const user =await User.create(req.body);
    
    res.status(200).json({
      status:"Success",
      data:user
    })
  
    next();
}

exports.login=async(req,res,next)=>{
    const {email,password}=req.body;
    const userExists=await User.findOne({email});
    if(!userExists){
        return res.status(404).json({
            status:"Failed",
            message:"User Doesn't Exists"
        })
    }

    const orignalPassword=userExists.password;
    const isAuthenticated=await userExists.comparePassword(password,orignalPassword);
    if(!isAuthenticated){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    const token=await tokenGenerator({email,role:userExists.role})
    const type=userExists.role;
    res.status(200).json({
        status:"Success",
        token:token,
        type
    })
}