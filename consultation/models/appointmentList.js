const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({
    // patientId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Patient',
    //     required: true
    // },
    physicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Physicians',
        required: true
    },
    scheduleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScheduleList'
    },
    scheduleType: {
        type: String,
        enum: ['inperson', 'virtual', 'both'],
        required:true
    },
    dateForBooking:{
        type: String,
        required:true
    },
    slot:{
        type: Array,
        required:true 
    },
    decription:{
        type: String,  
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected','complete','cancel'],
        default:'pending'
    },
    isbooked:{
        type: String,
        enum: ['yes', 'no'],
        default:'yes'
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("AppointmentList", scheduleSchema);
