const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let machineSchema = new Schema({
    McNo: {
        type: String
    },
}, {
        collection: 'machine'
    })

module.exports = mongoose.model('Machine', machineSchema)