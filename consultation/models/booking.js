const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    dateForBooking:{
        type:String,
    },
    schedulId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Schedule"
    },
    slotTypes:{
        type:String,
        enum:['inPerson','inVirtual'],
        required:true
    },
    isAvailable:{
        type:String,
        enum:['yes','no','cancel'],
        default:'yes'
    },
    allCanceled:{
        type:String,
        enum:['yes','no'],
        default:'no'
    },
    status:{
        type:String,
        enum:['active','cancel'],
        default:'active'
    },
    isBooked:{
        type:String,
        enum:['yes','no'],
        default:'no'
    }


},{timestamps:true});

module.exports = mongoose.model("Booking", bookingSchema);