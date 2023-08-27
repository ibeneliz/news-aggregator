const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var User = require('../models/user.js');
require("dotenv").config();
const loginRoutes = require('express').Router();
loginRoutes.use(bodyParser.json());

loginRoutes.get('/', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
        email: email
    }).then((user) => {
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Inavlid password."
            });
        }
        var token = jwt.sign({
            id: user.id
        }, process.env.API_SECRET, {
            expiresIn: 86400
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
});

module.exports = loginRoutes;