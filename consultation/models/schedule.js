const mongoose = require("mongoose");
 
const { ObjectId } = mongoose.Schema;
 
 
const scheduleSchema = new mongoose.Schema({
    // parentMedicalId: {
    //     type: String,
    //     trim: true,
    //     required: true
 
    // },
    // bookingType: {
    // //     type: Number,
    // //     required: true
 
    // // },
    physicianNmae: {
        type: String,
        trim: true,
        required: true
 
    },
    // bookedBy: {
    //     type: ObjectId,
    //     ref: 'Patients'
    // },
    isAlreadyBooked:{
        type: Boolean,
        default: false,
    },
    slotInString: {
        type: String,
        trim: true
 
    },
    physicianId: {
        type: String,
        trim: true,
        required: true
 
    },
    scheduleDate: {
        type: String,
        trim: true,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },

    message: {
        type: String,
        trim: true,
        required: true
    },

    //ACTIVE or INACTIVE
    scheduleStatus: {
        type: String,
        trim: true,
        required: true
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
module.exports = mongoose.model("Schedule", scheduleSchema);
