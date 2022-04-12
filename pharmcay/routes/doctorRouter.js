const express = require('express');
const router = express.Router();
const{createdoctor,doctorupdated} = require('../controllers/doctorContollers');
router.post('/createdoctor',createdoctor);
router.put('/doctorupdated/:id',doctorupdated)
module.exports=router;