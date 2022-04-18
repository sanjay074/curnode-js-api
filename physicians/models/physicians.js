const mongoose = require("mongoose");
const physicianSchema = new mongoose.Schema({
   physicianName:{
       type:String,
       required:true
   },
   DepartmentName:{
       type:String,
       required:true
   },
   Experience:{
       type:String,
       required:true
   },
   degree: {
    type: String,
},
language:{
    type:String,
    enum:['English','hindi'],
    default:"English"
}
});

module.exports = mongoose.model("Physician",physicianSchema);
