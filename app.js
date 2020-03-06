const express = require('express');
const bodyParser = require('body-parser');
require('dotenv/config');
require('./startup/db')();
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());


const employeesRoute = require('./routes/employees');
app.use('/api/employees', employeesRoute);

var port = Number(process.env.PORT || 3000);
app.listen(port, (err) => {
    if(err){
        console.log(err);
    }
});

module.exports = app;