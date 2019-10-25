const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const sha1 = require('sha1');

const Config = require('./../config');

require('./../models/auth_token');
const AuthToken = mongoose.model('auth_tokens');

const component = (req, res) => {

    const userInputSchema = {
        access_token: Joi.string().required(),
        refresh_token: Joi.string().required()
    }

    const userValidInputs = Joi.validate(req.body, userInputSchema);

    try {
        
        JWT.decode(userValidInputs.value.access_token, Config.ACCESS_TOKEN_SECRET_KEY);

        AuthToken.findOneAndRemove({ refresh_token: sha1(userValidInputs.value.refresh_token) })
        .then( token => {
            if(token) {
                res.json({
                    success: true
                });
            }
            else {
                res.json({
                    success: false
                });
            }
        })

    } catch (error) {
        res.json(error);
    }

}

module.exports = component;