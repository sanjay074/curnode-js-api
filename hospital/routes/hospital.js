const express = require('express');
const router = express.Router();
const{addHospital,findHospital,findOne,updated} = require('../controllers/hospitalcontroller');


router.post('/addHospital',  addHospital);
router.get('/findHospital',  findHospital);
router.get('/findHospitalOne/:id',  findOne);
router.put('/updated/:id',updated)
module.exports=router;
