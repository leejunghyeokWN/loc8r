const mongoose = require('mongoose');
require('./locations');

const dbURI = 'mongodb://tempUser:1234@cluster0-shard-00-00.f5csc.mongodb.net:27017,cluster0-shard-00-01.f5csc.mongodb.net:27017,cluster0-shard-00-02.f5csc.mongodb.net:27017/?ssl=true&replicaSet=atlas-tdoi7g-shard-0&authSource=admin&retryWrites=true&w=majority';
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