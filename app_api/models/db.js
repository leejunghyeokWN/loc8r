const mongoose = require('mongoose');
require('./users');
require('./locations');
//2018250045이중혁
const dbURI = 'mongodb+srv://tempUser:1234@cluster0.f5csc.mongodb.net/myatlasdb';
mongoose.connect(dbURI, {useNewUrlParser:true});

mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(){
  console.log('Mongoose connection error ' + dbURI);
});
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected ' + dbURI);
}); 