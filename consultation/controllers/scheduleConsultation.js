const ScheduleList = require('../models/scheduleList');
const Schedule = require('../models/schedule');
const Physician = require('../../physicians/models/physicians');
const { ObjectId } = require('mongodb')
const { exec } = require('child_process');
// const _ = require('lodash');
const Joi = require('joi'); 
//Created By Sanjay Kumar createScheduleList @15/04/2022
exports.createScheduleList = async (req, res) => {
    try {
        const data = req.body;
        const validateKey = ['physicianId', "availableDays", "repeatDaily"];
        for (let key of validateKey) {
            if (!data[key] || data[key] == undefined) {
                return res.status(400).json({
                    status: 0,
                    message: key + " required."
                })
            }
        }
        if (data.availableDays.length <= 0) {
            return res.status(400).json({
                status: 0,
                message: "availableDays required."
            })
        }
        data.repeatDaily = data.repeatDaily.toLowerCase();
        if (data.repeatDaily === "no") {
            if (!data.availableDate || data.availableDate == undefined || data.availableDate.length <= 0) {
                return res.status(400).json({
                    status: 0,
                    message: "availableDate required."
                })
            }
        }
        const response = await ScheduleList.findOne({ physicianId: data.physicianId, parentMedicalId: data.parentMedicalId }).lean();
        if (response) {
            return res.status(400).json({
                status: 0,
                message: "This physician schedule exist"
            })
        } else {
            const createdSchedule = await ScheduleList.create(data);
            if (createdSchedule) {
                return res.status(200).json({
                    status: 1,
                    message: "Schedule created successfully."
                })
            }
            return res.status(400).json({
                status: 0,
                message: "Something went wrong."
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 0,
            message: "" + error.toString()
        })
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns json
 * @description  getAvailableSloatAPI
 * @date 13/04/2022
 * @author Sanjay kuamr
 */  
exports.getAvailableSlot = async (req, res) => {
    try {
        const dateList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const data = req.body;
        const validateKey = ['physicianId', "dateForBooking"];
        for (let key of validateKey) {
            if (!data[key] || data[key] == undefined) {
                return res.status(400).json({
                    status: 0,
                    message: key + " required."
                })
            }
        }
        const searchDate = new Date(data.dateForBooking);
        const scheduleType = data.scheduleType || "both";
        const filterQuery = {
            availableDays: { $elemMatch: { isAvailable: "yes", dayName: dateList[searchDate.getDay()] } },
            status: "active",
            leaveDate: { $nin: [data.dateForBooking] },
            physicianId: ObjectId(data.physicianId)
        }
        if (scheduleType !== "both") {
            filterQuery.scheduleType = {
                $in: [scheduleType, "both"]
            }
        } else {
            filterQuery.scheduleType = scheduleType;
        }
        // console.log(JSON.stringify(filterQuery),"filterQueryfilterQueryfilterQuery");
        // const sechedule = await scheduleList.findOne(filterQuery).lean();
        // const sechedule = await scheduleList.findOne (filterQuery).lean();filterQuery");
        // const sechedule =
        // const
        const sechedule = await ScheduleList.aggregate([
            {
                $project: {
                    scheduleType: 1,
                    repeatDaily: 1,
                    availableDate: 1,
                    leaveDate: 1,
                    status: 1,
                    physicianId: 1,
                    availableDays: 1,
                    slotMinutes: 1,
                    availableDays: {
                        $filter: {
                            input: "$availableDays",
                            as: "availableDays",
                            cond: { $gte: ["$$availableDays.dayName", dateList[searchDate.getDay()]] }
                        }
                    }
                }
            },
            { $match: filterQuery }
        ]);
        if (sechedule && sechedule.length > 0) {

            const slotList = getSlots(sechedule[0].availableDays[0].startTime, sechedule[0].availableDays[0].endTime, sechedule[0].slotMinutes);

            const existAppointment = await appointmentList.find({
                physicianId:sechedule[0].physicianId,
                dateForBooking:data.dateForBooking,
                scheduleId:sechedule[0]._id,
                isbooked:"yes"
            },{slot:1,_id:0}).lean(); 
            const availableSlots=slotList.filter(item=>! existAppointment.some(element=>JSON.stringify(item)===JSON.stringify(element.slot)));
            // console.log(availableSlots,"availableSlotsavailableSlots");
            return res.status(200).json({
                status: 1,
                message: "success",
                data: {
                    secheduleId: sechedule[0]._id,
                    physicianId: sechedule[0].physicianId,
                    scheduleType: data.scheduleType,
                    dateForBooking: data.dateForBooking,
                    availableSlots: availableSlots
                }
            })
        }
        return res.status(400).json({
            status: 0,
            message: "Sechedule not available"
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 0,
            message: "" + error.toString()
        })
    }
}; 
//Created By Sanjay Kumar @17/04/2022
function getSlots(start, end, slotTime) { // This function return the slot data
    let startTime = new Date("2022-04-17");
    let endTime = new Date("2022-04-18");

    startTime.setHours(start.split(':')[0]);
    startTime.setMinutes(start.split(':')[1]);

    endTime.setHours(end.split(':')[0]);
    endTime.setMinutes(end.split(':')[1]);

    let startLoop = startTime.getTime();
    endTime.setMinutes(endTime.getMinutes() - slotTime)
    endTime = endTime.getTime();

    const allSlots = [];
    for (startLoop; startLoop < endTime; startLoop = startTime.getTime()) {
        let tempSlot = [];
        tempSlot.push(`${("0" + startTime.getHours()).slice(-2)}:${(startTime.getMinutes() + "0").slice(0, 2)}`);
        startTime.setMinutes(startTime.getMinutes() + slotTime);
        tempSlot.push(`${("0" + startTime.getHours()).slice(-2)}:${(startTime.getMinutes() + "0").slice(0, 2)}`);
        allSlots.push(tempSlot);
    }
    return allSlots;
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns json
 * @description addSchedule
 * @date 18/04/2022
 * @author Sanjay kuamr
 */  
exports.addSchedule = async (req, res, next) => {

    //let comment = {text:req.body.comment};

    // const date = '18-04-2022';
    // const time = '12:09';
    let detailSchema = Joi.object(
        {
            // bookingType: Joi.number().required().error(e => "bookingType is required"),
            physicianNmae: Joi.string().required(),
            physicianId: Joi.string().required(),
            scheduleDate: Joi.string().required(),
            startTime: Joi.date().required(),
            endTime: Joi.date().required(),
            message: Joi.string().optional(),
            scheduleStatus: Joi.number().optional().allow(''),
            slots: Joi.optional().allow('')
        })
    //  let { loginUserId, latitude, longitude, uploadLicence, address, vehicleVerient, vinNumber, experience, fullName, email, mobile, gender, dob, nemtProvider, socialSequrity, isLegel, convicatedCrime, drugTest, alcoholeTest, moterVehicleCheck } = req.body;
    let result =detailSchema.validate(req.body)
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return ;
    } 
    console.log("ScheduleScheduleScheduleSchedule", req.body);
    Schedule.find({
        physicianId: req.body.physicianId, bookingType: req.body.bookingType,
        scheduleDate: req.body.scheduleDate, startTime: req.body.startTime, endTime: req.body.endTime
    })
        .exec((err, alreadySchedule) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }

            console.log("user is node js")
            console.log("alreadySchedulealreadySchedulealreadySchedule", alreadySchedule);

            if (alreadySchedule.length != 0) {
                return res.status(400).json({
                    error: "that slot is already added"
                });
            } else {
                console.log("alreadySchedulealreadySchedulealreadySchedule", new Date(req.body.startTime).getHours());
                //console.log("alreadySchedulealreadySchedulealreadySchedule",req.body.endTime.getHours() );

                let schedule = new Schedule(req.body);
                var startDate = new Date(req.body.startTime);
                var endDate = new Date(req.body.endTime);
                console.log("endDateendDateendDateendDate", endDate.getUTCHours());
                schedule.slotInString = startDate.getUTCHours() + "." + startDate.getUTCMinutes() + "-" +
                    endDate.getUTCHours() + "." + endDate.getUTCMinutes();
                schedule.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    }
                    res.json(result);
                });
            }


        });

}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns json
 * @description getAllSchedule api
 * @date 18/04/2022
 * @author Sanjay kuamr
 */  
exports.getAllSchedule = async (req, res, next) => {

    if (req.body.physicianId == undefined ) { //|| req.body.bookingType == undefined
        return res.status(400).json({
            error: "physicianId or bookingType is required"
        });
    }
    await Schedule.find(function (err, items) {
        // console.log(items.filter((x)=>x.parentMedicalId==req.body.parentMedicalId&&x.bookingType==req.body.bookingType));       
        if (err) {
            return res.status(400).json({
                error: err
            })

        }
        return res.status(200).json({
            data: items.filter((x) => x.parentMedicalId == req.body.parentMedicalId && x.bookingType == req.body.bookingType)
        })
    })
    // .exec((err, posts) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: err
    //         });
    //     }
    //     console.log(exec)
    //     res.json({"data":posts});
    // });

}

