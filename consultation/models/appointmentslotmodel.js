const mongoose = require("mongoose");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
 
 
const AppointmentsSlotSchema = new mongoose.Schema({
    date: {
        type: String,
        default: Date.now
 
    },
    
 
    physicianId: {
        type: String,
        trim: true,
},
slots:[{
    slotTime: {
        type: String,
        trim: true,
    } ,
    bookedBy: {
        type: ObjectId,
        ref: 'User'
    }

}]
  
   
 

});

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * Keep in mind: virtual properties (password) don’t get persisted in the database.
 * They only exist logically and are not written to the document’s collection.
 */

// virtual field
 
 
module.exports = mongoose.model("AppointmentSlots", AppointmentsSlotSchema);
