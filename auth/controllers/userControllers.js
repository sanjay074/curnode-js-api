const Joi = require('joi');
const User = require('../models/user');
const UserOTPVerification = require('../models/UserOTPVerification');
const nodemailer = require("nodemailer");
const  bcrypt =require('bcrypt');
// nodemailer 
var transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:587,
  secure:false,
  requireTLS:true,
  auth:{
    user:process.env.usere,
     pass:process.env.userp
  }
});
transporter.verify((error ,succrss)=>{
  if(error){
    console.log(error);
  }else{
    console.log("Ready for messages");
    console.log(succrss);
  }
});
exports.userSignup = async (req ,res)=>{
  let {name,phone,email,password,referralCode}= req.body 
  const userSchema = Joi.object({
    name:Joi.string().required(),
    phone:Joi.number().required(),
    email:Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    referralCode:Joi.number().required(),
  });
   let result =userSchema.validate(req.body)
   if(result.error){
       res.status(400).send(result.error.details[0].message)
       return ;
   } 
   const exist = await User.exists({email:req.body.email});
        if(exist){
            return  res.status(400).send("This email is already taken!");
        } 
      // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);    
    const newuser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      referralCode,
      verified:false

});
try{
  const saveduser = await newuser.save();
  sendOTPVerificationEmail(saveduser, res);
  res.status(200)
   
 }catch(err){
     res.status(500).json(err)
 }
}
exports.userlogin = async(req ,res)=>{
  const userSchema = Joi.object({
    email:Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  });
   let result =userSchema.validate(req.body)
   if(result.error){
       res.status(400).send(result.error.details[0].message)
       return ;
   } 
  try{
     const user = await User.findOne({email: req.body.email});
    if(!user){
      res.status(401).json("Wrong credentials");
    }  
   const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(401).json("Wrong credentials");
    }
    res.status(200).json(user)
  }catch(err){
    res.status(500).json(err)
}
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns json
 * @description userSignup API (localhost:3000/api/userSignup)
 * @date 11/04/2022
 * @author Sanjay kuamr
 */

const sendOTPVerificationEmail = async ({ _id ,email},res)=>{
  try{
    const otp = `${Math.floor(1000 +Math.random()* 9000)}`;
    //mail options
    const mailOptions={
      from:process.env.usere,
      to:email,
      subject:"Verify Your Email",
      html: `<p>Enter${otp} in the app to verify your email address and the signup</p>`
      
    };
    // hash the otp 
    const saltRounds = 10 ;
    const hashedOTP =await bcrypt.hash(otp ,saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId:_id ,
    otp : hashedOTP,
    createdAt:Date.now(),
    expiresAt:Date.now()+3600000
    });
    // save otp 
    await newOTPVerification.save();
    transporter.sendMail(mailOptions);
    res.json({
      status:"PENDING",
      message:"Verification OTP send the user email",
      date:{
        userId: _id,
        email,
      },
    })
  }catch(err){
    res.json({
      status:"FAILED",
      message:error.message,
    });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns json
 * @description userverifeyOTP API (localhost:3000/api/userverifyOTP)
 * @date 11/04/2022
 * @author Sanjay kuamr
 */
exports.userverifyOTP = async (req ,res)=>{
  try{
    let{userId ,otp} = req.body;
    if(!userId || !otp){
      throw Error("Empty otp details are not allowed");
    }else{
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      })
      if(UserOTPVerificationRecords.length <=0){
        throw new Error(
          "Account record doesn,t exist or has been verified already .Please sign up"
        );
      }else{
        const { expiresAt} = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        if(expiresAt <Date.now()){
         await UserOTPVerification.deleteMany({userId});
         throw new Error("OTP has expired.Please request again");
        }else{
          const validOTP = await bcrypt.compare(otp ,hashedOTP);
          if(!validOTP){
            throw new Error("Invalid code passed .Check your inbox.");
          }else{
            await User.updateOne({_id: userId},{verified:true});
            await UserOTPVerification.deleteMany({userId});
            res.json({
              status:"VERIFIED",
              message: "User email verfied successfully",
            });
          }
        }
      }
    }

  }catch(error){
    res.json({
      status:"FAILED",
      message:error.message,
    });
  }
} 
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns json
 * @description resendOTP API (localhost:3000/api/resendOTP)
 * @date 11/04/2022
 * @author Sanjay kuamr
 */
exports.resendOTP = async (req ,res)=>{
  try{
    let { userId ,email} = req.body;
    if(!userId || !email){
      throw Error("Enter user details are not allowed");
    }else{
      await UserOTPVerification.deleteMany({userId});
      sendOTPVerificationEmail({_id: userId ,email},res);
    }
  }catch(error){
    res.json({
      status:"FAILED",
      message:error.message,
    });
  }
} 
// find all users
exports.findAllUser= async(req ,res)=>{
  try{
  const FindUser = await User.find();
  res.status(200).json(FindUser);
  }catch(err){
      res.status(500).json(err)
  }
}  
// find one user
exports.findOne = async(req,res)=>{
  try{
   const  Finduser = await User.findById(req.params.id);
   res.status(200).json(Finduser);
  }catch(err){
      res.status(500).json(err);
  }
}
