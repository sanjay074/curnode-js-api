const express = require('express');
const router = express.Router();
const{userSignup,userlogin,userverifyOTP,resendOTP,findAllUser,findOne} = require('../controllers/userControllers');


router.post('/userSignup',userSignup);
router.post('/userlogin' ,userlogin);
router.post('/userverifyOTP',userverifyOTP);
router.post('/resendOTP',resendOTP);
router.get('/findAllUser',findAllUser);
router.get('/findOne/:id',findOne);
module.exports=router;