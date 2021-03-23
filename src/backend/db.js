const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://icezjetsada:Irishz01@cluster0.kxplg.mongodb.net/die?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db

module.exports = {
    db: 'mongodb+srv://icezjetsada:Irishz01@cluster0.kxplg.mongodb.net/die?retryWrites=true&w=majority'
};