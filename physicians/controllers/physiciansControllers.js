const Physician = require('../models/physicians');
exports.addphysician = async(req ,res,next)=>{
    try{
        let addphysiciannew = new Physician(req.body);
        addphysiciannew.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}
catch(error) {
    console.log("errror",error)
}
}
exports.getAllphysician= async (req, res, next) => {
    Physician.find()
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({ "data": posts });
        });
}