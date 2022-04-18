const express = require('express');
const router = express.Router();
const{createScheduleList,getAvailableSlot,addSchedule,getAllSchedule} = require('../controllers/scheduleConsultation');
router.post('/createScheduleList' ,createScheduleList);
router.post('/getAvailableSlot',getAvailableSlot);
router.post('/addSchedule',addSchedule);
router.post('/getAllSchedule',getAllSchedule);
module.exports=router;