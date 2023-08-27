const newsRoutes = require('express').Router();
const bodyParser = require('body-parser');
const newsAPIPromise = require('../controller/newsHelper.js');
const URLSearchparams = require('url-search-params');
const verifyToken = require('../middleware/verifyToken.js');
const redisClient = require("../middleware/redis-cache.js");
var User = require('../models/user.js');

newsRoutes.use(bodyParser.json());

let baseUrl = 'https://newsapi.org/v2/top-headlines/';

newsRoutes.get('/', verifyToken, async(req, res) => {
    try{
        if(!req.user && req.message){
            return res.status(403).send({
                message: req.message
            });
        }
        if(!req.user && req.message == null){
            return res.status(401).send({
                message: "Invalid jwt token"
            });
        }
        let totalResults = [];
        let body = req.user.preferences;
        const searchParams3 = new URLSearchparams({apiKey: process.env.API_KEY});
        for(let i=0; i< body.length; i++){
            let key = body[i].country + '-' + body[i].category;
            let response = await redisClient.Client.get(key);
            if(response == null || response.err){
                console.log("Calling external news api");
                const searchParams1 = new URLSearchparams({category: body[i].category});
                const searchParams2 = new URLSearchparams({country: body[i].country});
                const resp = await newsAPIPromise(`${baseUrl}?${searchParams1}&${searchParams2}&${searchParams3}`)
                await redisClient.Client.set(key, JSON.stringify(resp));
                totalResults.push(resp);
            }else{
                console.log('Fetching from cache.', response.err);
                totalResults.push(JSON.parse(response));
            }
        }
        return res.status(200).send(totalResults);
    }catch(error){
        console.log('Error in fetching news based on preference.', error);
        return res.status(500).send("Error occured in fetching news based on preference.");
    }
});

// Since there are no id for articles, marking source as read and favorite 
newsRoutes.post(':id/read', verifyToken, (req, res) => {
    try{
        if(!req.user && req.message){
            return res.status(403).send({
                message: req.message
            });
        }
        if(!req.user && req.message == null){
            return res.status(401).send({
                message: "Invalid jwt token"
            });
        }
        let readArray = req.user.read;
        readArray.push(req.query.url);
        let filter = { _id: req.user._id };
        let updateRead = {
            $set: { "read": readArray },
        };
        User.updateOne(filter, updateRead, (err, res) => {
            if (err) {
                console.log("Updated user unsuccessfully.", err);
            }else{
                console.log("Updated user successfully.", res)
            }
        });
        return res.status(200).send("News article is marked as read.");
    }catch(error){
        return res.status(500).send("Error occured in updating news article as read.");
    }
});

newsRoutes.post(':id/favorite', verifyToken, (req, res) => {
    try{
        if(!req.user && req.message){
            return res.status(403).send({
                message: req.message
            });
        }
        if(!req.user && req.message == null){
            return res.status(401).send({
                message: "Invalid jwt token"
            });
        }
        let favoriteArray = req.user.favorite;
        favoriteArray.push(req.query.url);
        let filter = { _id: req.user._id };
        let updateFavorites = {
            $set: { "favorite": favoriteArray },
        };
        User.updateOne(filter, updateFavorites, (err, res) => {
            if (err) {
                console.log("Updated user unsuccessfully.", err);
            }else{
                console.log("Updated user successfully.", res)
            }
        });
        return res.status(200).send("News article is marked as favorite.");
    }catch(error){
        return res.status(500).send("Error occured in updating news article as favorite.");
    }
});

newsRoutes.get('/read', verifyToken, async(req, res) => {
    try{
        if(!req.user && req.message){
            return res.status(403).send({
                message: req.message
            });
        }
        if(!req.user && req.message == null){
            return res.status(401).send({
                message: "Invalid jwt token"
            });
        }
        let totalResults = [];
        let body = req.body;
        const searchParams2 = new URLSearchparams({apiKey: process.env.API_KEY});
        for(let i=0; i< body.length; i++){
                const searchParams1 = new URLSearchparams({id: body[i]});
                const resp = await newsAPIPromise(`${baseUrl}?${searchParams1}&${searchParams2}`);
                totalResults.push(resp);
        }
        let updateRead = {
            $set: { "read": readArray },
        };
        User.updateOne(filter, updateRead, (err, res) => {
            if (err) {
                console.log("Updated user unsuccessfully.", err);
            }else{
                console.log("Updated user successfully.", res)
            }
        });
        return res.status(200).send("News article is marked as read.");
    }catch(error){
        return res.status(500).send("Error occured in updating news article as read.");
    }
});

module.exports = newsRoutes;