const express = require('express');
const router = express.Router();
const{addphysician,getAllphysician} = require('../controllers/physiciansControllers');

 router.post('/addphysician',addphysician);
 router.get('/getAllphysician',getAllphysician);
module.exports=router;