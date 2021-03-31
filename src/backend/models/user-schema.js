const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    user: {
        type: String
    },
    seq: {
        type: Number
    },
    group: {
        type: Number
    }
}, {
        collection: 'user'
    })

module.exports = mongoose.model('User', userSchema)