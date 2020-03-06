const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const { createLogger, format, transports} = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

var logger =
  winston.createLogger({
    format: combine(
      label({
        label: 'test label'
      }),
      timestamp(),
      prettyPrint()
    ),
    transports: [
      new winston.transports.File({
        filename: 'info.log',
        level: 'info'
      }),
      new winston.transports.File({
        filename: 'errors.log',
        level: 'error'
      })
    ]
  });
  
exports.logger = logger;


