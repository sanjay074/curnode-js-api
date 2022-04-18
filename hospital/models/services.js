const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const servicesSchema = new mongoose.Schema({
    hospitalId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    services:{
        type: Array
    }
    })
module.exports = mongoose.model('Services', servicesSchema);