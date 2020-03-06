const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());


const employeesRoute = require('./routes/employees');

app.use('/api/employees', employeesRoute);

var port = Number(process.env.PORT || 3000);

mongoose.connect('mongodb://localhost/employee-db', {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected to db");
    }
});


app.listen(port, (err) => {
    console.log(err);
});


module.exports = app;