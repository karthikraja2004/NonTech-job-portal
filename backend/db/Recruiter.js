const mongoose = require("mongoose");
const bcrypt=require("bcryptjs")
let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
        },
        msg: "Phone number is invalid!",
      },
    },
    bio: {
      type: String,
    },
  },
  { collation: { locale: "en" } }
);

schema.pre('save',async function(next){
  if(this.isModified('contactNumber'))
  {
    try{
      this.contactNumber=await bcrypt.hash(this.contactNumber,10);
    }
    catch(error)
    {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("RecruiterInfo", schema);
