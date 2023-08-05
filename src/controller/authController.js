const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var User = require('../models/user.js');
require("dotenv").config();

var register = (req, res) => {
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 8);
    let role = req.body.role;

    const user = new User({
        fullName: fullName,
        email: email,
        password: password,
        role: role
    });

    user.save().then(data => {
        return res.status(200).send("User registered successfully.");
    }).catch(error => {
        return res.status(500).send("User registered failed.");
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
        console.log(error);
        res.status(500).send({
            message: error
        });
    });
};

module.exports = {register, signin};