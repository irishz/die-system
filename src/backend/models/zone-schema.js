const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let zoneSchema = new Schema({
    zone: {
        type: String
    },
    seq: {
        type: Number
    },
    group: {
        type: Number
    }
}, {
        collection: 'zone'
    })

module.exports = mongoose.model('Zone', zoneSchema)