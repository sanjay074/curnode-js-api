const express = require('express');
const router = express.Router();
const{userSignup,userlogin,userverifyOTP,resendOTP,findAllUser,findOne,verifyRefreshTokens,loggeduser} = require('../controllers/userControllers');
const {phoneLogin,verifyOTP} = require('../controllers/phoneLogin');

router.post('/userSignup',userSignup);
router.post('/userlogin' ,userlogin);
router.post('/userverifyOTP',userverifyOTP);
router.post('/resendOTP',resendOTP);
router.get('/findAllUser',findAllUser);
router.get('/findOne/:id',findOne);
router.post('/phoneLogin',phoneLogin);
router.post("/verifyOTP", verifyOTP);
router.post('/resfreshToken',verifyRefreshTokens);
router.delete('/Logged',loggeduser)
module.exports=router;