const jwt = require('jsonwebtoken');
const user = require('../models/user.js');

const verifyToken = (req, res, next) => {
    if(req.headers && req.headers.authorization){
        jwt.verify(req.headers.authorization, process.env.API_SECRET, function(error, decodedValue){
            if(error){
                req.user = undefined;
                next();
            }
            if(decodedValue){
                user.findOne({
                    _id: decodedValue.id
                }).then(user => {
                    req.user = user;
                    next();
                }).catch(error => {
                    console.log("Error in access token",error);
                    return res.status(401).send("You access token is either invalid or missing");
                });
            }
        });
    }else{
        req.user = undefined;
        req.message = "Authorization header not found";
        next();
    }
};

module.exports = verifyToken;