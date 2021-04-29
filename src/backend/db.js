const mongoose = require('mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/die?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db

module.exports = {
    db: 'mongodb://127.0.0.1:27017/die?retryWrites=true&w=majority'
};