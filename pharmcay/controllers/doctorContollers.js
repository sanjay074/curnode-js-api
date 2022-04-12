const Doctor = require('../models/doctor');
exports.createdoctor = async (req, res, next) => {
    try{
        
        let addDoctor = new Doctor(req.body);
        addDoctor.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.status(201).json(result);
        });
}
catch(error) {
    console.log("errror",error)
}
};
exports.getAllDoctor = async (req, res, next) => {
    Doctor.find()
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({ "data": posts });
        });

} 
exports.doctorupdated =async(req,res)=>{
    try{
    const updatedUser =await Doctor.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
    res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
}
