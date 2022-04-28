const mongoose = require("mongoose");
//const uuidv1 = require("uuid/v1");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");
const boolean = require("joi/lib/types/boolean");
const { ObjectId } = mongoose.Schema;
 
 
const AppointmentsSchema = new mongoose.Schema({
    scheduleDate: {
        type: String,
        default: Date.now
 
    },

    createdOn: {
        type: String,
        default: Date.now
 
    },
    
 
    physicianId: {
        type: ObjectId,
        ref: 'Physicians'
    },
    // parentPrcaticeId: {
    //     type: ObjectId,

    //     ref: 'MedicalFacility'
    // },

    // 0 pending, 1 confirmed, 2 cancelled
    appointmentStatus: {
        type: Number,
        default: 0,
    },
    bookedSlot: {
        type: String,
        trim: true,
    },


    consultingFee: {
        type: String,
        trim: true,
    },
      //0 for virtual, 1 for in person
    bookingType: {
        type: Number,
        trim: true,
    },
    diseaseType: {
        type: String,
        trim: true,
    },
     
     
    patientId: {
        type: String,
        ref: 'Patient'
        
    },
     
    patientDetails: {
        pName: {
            type: String,
            trim: true,
        },
        pEmail: {
            type: String,
            trim: true,
        },
        pNumber: {
            type: String,
            trim: true,
        },
        pAddress: {
            type: String,
            trim: true,
        },
    },
    bookedTimeSlot: {
        type: String,
        trim: true,
    },
    prescriptions: [{
        medicineName: {
            type: String,
            trim: true
        },        
        doses: {
            type: String,
            trim: true
        },
        frequency: {
            type: String,
            trim: true
        },
        duration: {
            type: String,
            trim: true
        },
        instruction: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        images: [
            {
                name: {
                    type: String,
                },
                url: {
                    type: String,
                }
            }
        ]
    }],
    reports: [{
        name: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        images: {
            type:Array
        }
    }],
   
 

});

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * Keep in mind: virtual properties (password) don’t get persisted in the database.
 * They only exist logically and are not written to the document’s collection.
 */

// virtual field

module.exports = mongoose.model("Appointments", AppointmentsSchema);
