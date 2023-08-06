const preferenceRoutes = require('express').Router();
const bodyParser = require('body-parser');
var User = require('../models/user.js');
var verifyToken = require('../middleware/verifyToken.js');
const validator = require('../validator/validator.js');

preferenceRoutes.use(bodyParser.json());

preferenceRoutes.get('/', verifyToken, (req, res) => {
    if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }
    if (!req.user && req.message == null) {
        return res.status(401).send({
            message: "Invalid jwt token"
        });
    }
    if (req.user.length == 0) {
        return res.status(404).json({ "message": "Preferences does not exist." });
    }
    return res.status(200).json(req.user.preferences);
});

preferenceRoutes.post('/', verifyToken, (req, res) => {
    if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }
    if (!req.user && req.message == null) {
        return res.status(401).send({
            message: "Invalid jwt token"
        });
    }
    const isValid = validator.validatorInfo(req.body.preferences);
    if (isValid.status) {
        let filter = { _id: req.user._id };
        let updatePref = {
            $set: { "preferences": req.body.preferences },
        };
        User.updateOne(filter, updatePref, (err, res) => {
            if (err) {
                console.log(err);
            }
        });
        return res.status(200).send("Preference updated successfully.");
    } else {
        return res.status(400).json(isValid);
    }
});

module.exports = preferenceRoutes;
