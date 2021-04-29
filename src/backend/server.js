let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
// let database = require('./db');


const zoneRoute = require('./route/zone.routes');
const machineRoute = require('./route/machine.routes');
const dieUsageRoute = require('./route/dieUsage.routes');
const locationRoute = require('./route/location.routes');
const userRoute = require('./route/user.routes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/die?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected sucessfully !')
},
    error => {
        console.log('Database could not be connected : ' + error)
    }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/zone', zoneRoute);
app.use('/machine', machineRoute);
app.use('/die-usage', dieUsageRoute);
app.use('/location', locationRoute);
app.use('/user', userRoute);


const port = process.env.PORT || 4002;
const server = app.listen(port, '0.0.0.0', () => {
    console.log('Connected to port ' + port)
})

// Error Handling
app.use((req, res, next) => {
    next(console.error(404));
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});