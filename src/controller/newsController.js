const newsRoutes = require('express').Router();
const bodyParser = require('body-parser');
const newsAPIPromise = require('../controller/newsHelper.js');
const URLSearchparams = require('url-search-params');
const verifyToken = require('../middleware/verifyToken.js');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
var User = require('../models/user.js');

newsRoutes.use(bodyParser.json());

let url = 'https://newsapi.org/v2/top-headlines/';

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
            if(myCache.get(key) == undefined){
                const searchParams1 = new URLSearchparams({category: body[i].category});
                const searchParams2 = new URLSearchparams({country: body[i].country});
                const resp = await newsAPIPromise(`${url}?${searchParams1}&${searchParams2}&${searchParams3}`)
                myCache.set(key, resp, 10000 );
                totalResults.push(resp);
            }else{
                totalResults.push(myCache.get(key));
            }
        }
        return res.status(200).send(totalResults);
    }catch(error){
        return res.status(500).send("Error occured in fetching news based on preference.");
    }
});

module.exports = newsRoutes;