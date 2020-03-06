const mongoose = require('mongoose');

module.exports = function () {
  mongoose.connect('mongodb://localhost/employee-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to db");
    }
  });

}