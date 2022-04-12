const mongoose = require("mongoose");
const   DoctorSchema = new mongoose.Schema({ 
    DoctorName:{
        type: String,
        required: true

    },
   Exp:{
      type:String,
      required:true
   },
   language:{
    type: String,  
    enum:['Hindi','English'],
    default: 'Hindi'
   },
   Consultationtype:{
      type: String,
      enum:['Free','NO'],
      default:'Free'
   },
   img:
    {
        data: Buffer,
        contentType: String
    },
   Rate:{
       type:String,
       required:true
   }
   
});


module.exports = mongoose.model("Doctor", DoctorSchema);


