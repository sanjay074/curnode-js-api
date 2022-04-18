const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({
    physicianId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Physicians',
        required: true
    },
    scheduleType:{
        type: String,
        enum: ['inperson', 'virtual', 'both'],
        default: 'both'
    },
    availableDays:[
        {
            dayName:{
                type: String,
                required: true
            },
            startTime:{
                type: String,
                required: true
            },
            endTime:{
                type: String,
                required: true
            },
            isAvailable:{
                type: String,
                enum: ['yes', 'no'],
                default: 'yes'
            }
        }
    ],
    slotMinutes:{
        type:Number
    },
    repeatDaily: {
        type: String,
        enum: ['yes', 'no'],
        default: 'yes'
    },
    availableDate: {
        type: Array
    },
    leaveDate: {
        type: Array
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active'
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

module.exports = mongoose.model("ScheduleList", scheduleSchema);
