const newsRoutes = require('express').Router();
const bodyParser = require('body-parser');
const newsAPIPromise = require('../controller/newsHelper.js');
const URLSearchparams = require('url-search-params');
const verifyToken = require('../middleware/verifyToken.js');

newsRoutes.use(bodyParser.json());

let url = 'https://newsapi.org/v2/top-headlines';

newsRoutes.get('/:source', verifyToken, (req, res) => {
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
    let sourceName = req.query.source;
    const searchParams1 = new URLSearchparams({sources: sourceName});
    const searchParams2 = new URLSearchparams({apiKey: process.env.API_KEY});
    newsAPIPromise(`${url}?${searchParams1}&${searchParams2}`).then(resp => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(resp);
    }).catch(error => {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).send("Error occured.");
    });
});

module.exports = newsRoutes;