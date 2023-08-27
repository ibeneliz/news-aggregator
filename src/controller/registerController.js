const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
var User = require('../models/user.js');
require("dotenv").config();
var cachedKeys = require('../models/cachedKeys.js');
const { check, validationResult } = require('express-validator');
const registerRoutes = require('express').Router();
registerRoutes.use(bodyParser.json());

// Validation rules.
var registerValidate = [
    check('fullName', 'Full name must be characters').isString().isLength({ min: 3 }).withMessage('Full name must be at least 3 Characters').trim().escape(),
    check('email', 'Email must be a valid email id').isEmail().normalizeEmail(),
    check('preferences.*.country', 'Country is required').exists(),
    check('preferences.*.category', 'Category is required').exists(),
    check('read', 'Read must be empty').isEmpty(),
    check('favorite', 'Favorite must be empty').isEmpty(),
    check('password').isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches('[0-9]').withMessage('Password must contain a number')
        .matches('[A-Z]').withMessage('Password must contain an uppercase letter')];

registerRoutes.post('/', registerValidate, (req, response) => {
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 8);
    let preferences = req.body.preferences;
    let read = req.body.read;
    let favorite = req.body.favorite;

    const user = new User({
        fullName: fullName,
        email: email,
        password: password,
        preferences: preferences,
        read: read,
        favorite: favorite
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }
    else {
        user.save().then(() => {
            for (let i = 0; i < preferences.length; i++) {
                let key = preferences[i].country + '-' + preferences[i].category;
                const aKey = new cachedKeys({
                    articlekey: key
                });
                aKey.save().then(() => {
                    console.log("Key added successfully.");
                }).catch(error => {
                    console.log("Error in adding aKey.", error);
                });
            }
            return response.status(200).send("User registered successfully.");
        }).catch(error => {
            console.log("Error in registering user.", error);
            return response.status(500).send("User registered failed.");
        });
    }
});

module.exports = registerRoutes;