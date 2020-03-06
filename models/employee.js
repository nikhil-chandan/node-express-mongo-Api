const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 50
      },
      lastName: {
       type: String,
       required: false,
       minlength: 5,
       maxlength: 50
     },
     address: {
       type: String,
       required: false,
       minlength: 5,
       maxlength: 100
     },
     mobileNo: {
       type: Number,
       required: false,
       minlength: 10,
       maxlength: 15
     },
     employeeId: {
       type: Number,
       required: false,
       minlength: 4,
       maxlength: 15
     },
     designation: {
       type: String,
       required: false,
       minlength: 10,
       maxlength: 15
     },
     location: {
       type: String,
       required: false,
       minlength: 1,
       maxlength: 30
     },
     isDeleted: {
      type: Boolean,
      default: false
  },
  
});

module.exports = mongoose.model("employee", employeeSchema);