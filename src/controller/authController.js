const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var User = require('../models/user.js');
require("dotenv").config();
var cachedKeys = require('../models/cachedKeys.js');

var register = (req, response) => {
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 8);
    let role = req.body.role;
    let preferences = req.body.preferences;
    let read = req.body.read;
    let favorite = req.body.favorite;

    const user = new User({
        fullName: fullName,
        email: email,
        password: password,
        role: role,
        preferences: preferences,
        read: read,
        favorite: favorite
    });

    user.save().then(() => {
        for(let i=0; i<preferences.length; i++){
            let key = preferences[i].country + '-' + preferences[i].category;
            const aKey = new cachedKeys({
                articlekey: key
            });
            user.findOne({
                articlekey: key
            }).then(() => {
                console.log("Already in cache.")
            }).catch(() => {
                aKey.save().then(() => {
                    console.log("Key added successfully.");
                }).catch(error => {
                    console.log("Error in adding aKey.", error);
                });
            });
        }
        return response.status(200).send("User registered successfully.");
    }).catch(error => {
        console.log("Error in registering user.", error);
        return response.status(500).send("User registered failed.");
    });
};

var signin = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
        email: email
    }).then((user) => {
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid){
            return res.status(401).send({
                accessToken: null,
                message: "Inavlid password."
            });
        }
        var token = jwt.sign({
            id: user.id
        }, process.env.API_SECRET, {
            expiresIn : 86400
        });
        return res.status(200).send({
            accessToken: token,
            message: "Login successfull"
        });
    }).catch(error => {
        res.status(500).send({
            message: error
        });
    });
};

module.exports = {register, signin};