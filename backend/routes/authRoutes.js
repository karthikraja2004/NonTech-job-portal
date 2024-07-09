const express=require("express");
const passport=require("passport");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const authKeys=require("../lib/authKeys");
const User=require("../db/User");
const JobApplicant=require("../db/JobApplicant");
const Recruiter=require("../db/Recruiter");
const router=express.Router();

router.post("/signup",async(req,res)=>{
    const data=req.body;
    console.log(data);
    if(data.password.length<8){
        res.status(400).json({
           
                message:"Password must be more than 8 characters.",
          
        })
        return;
    }

    try{

        const existingEmailUser= await User.findOne({email:data.email});
        if(existingEmailUser){
            return res.status(400).json({
                message:"Email ID already exists"
            });
        }

        if(data.aadhaar_number){
            const existingAadhaarUser=await User.findOne({aadhaarNumber:data.aadhaar_number});
            if(existingAadhaarUser)
            {
                return res.status(400).json({
                    message:"Aadhaar number already exists."
                });
            }
        }
        const hashedPassword=await bcrypt.hash(data.password,10);
        const hashedAadhaarNumber=await bcrypt.hash(data.aadhaar_number,10);
        let user=new User({
            email:data.email,
            password:hashedPassword,
            type:data.type,
            aadhaarNumber:hashedAadhaarNumber
        });

        await user.save();
        let userDetails;
        if(data.type=="Recruiter")
        {
            userDetails=new Recruiter({
                userId:user._id,
                name:data.name,
                contactNumber:data.contactNumber,
                bio:data.bio,
            });
        }
        else{
            userDetails=new JobApplicant({
                userId:user._id,
                name: data.name,
                education: data.education,
                skills: data.skills,
                rating: data.rating,
                resume: data.resume,
                profile: data.profile,

            });
        }
        await userDetails.save();

        const token=jwt.sign({_id:user._id},authKeys.jwtSecretKey);
        res.json({
            token:token,
            type:user.type,
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"Server error."});
    }
});

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{session:false},function(err,user,info){
        if(err)
        {
            return next(err);
        }
        if(!user){
            res.status(401).json(info);
            return;
        }
        const token=jwt.sign({_id:user._id},authKeys.jwtSecretKey);
        res.json({
            token:token,
            type:user.type,
        });
    })(req,res,next);
})
module.exports=router;