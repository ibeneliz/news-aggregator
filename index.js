const express = require('express');
const bodyParser = require('body-parser');
const routes = require('express').Router();
const mongoose = require('mongoose');
const {register, signin} = require('./src/controller/authController.js');
const preferenceInfo = require('./src/controller/preferenceInfo.js');
const newsInfo = require('./src/controller/newsController.js');

const app = express();
app.use(bodyParser.json());
app.use(routes);
const PORT = 3000;

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to News Aggregator API.");
})

try{
    mongoose.connect(process.env.DB_CONNECTION_STRING,{
     useUnifiedTopology : true,
     useNewUrlParser : true
    });
    console.log('Connected to db.');
 }catch (error){
     console.log(error);
 } 

app.post('/register', register);

app.post('/signin', signin);

app.use('/preferences', preferenceInfo);

app.use('/news',newsInfo);

app.listen(PORT, (error) => {
    if(!error){
        console.log(`Server has started successfully`);
    }else{
        console.log(`Error occured`);
    }
})