const Joi = require('@hapi/joi');
const JWT = require("jsonwebtoken");
const sha1 = require('sha1');
const mongoose = require('mongoose');

const Config = require('./../config');

require('./../models/auth_token');
const AuthToken = mongoose.model('auth_tokens');

const component = (req, res) => {

    const userInputSchema = {
        refresh_token: Joi.string().required()
    }

    const userValidInputs = Joi.validate(req.body, userInputSchema);

    if(userValidInputs.error) {
        res.json(userValidInputs.error);
    }

    else {
        try {
            
            const accessTokenDecodedValues = JWT.decode(userValidInputs.value.refresh_token, Config.REFRESH_TOKEN_SECRET_KEY);

            const tokenPayload = {
                user_id: accessTokenDecodedValues.user_id,
            }

            const accessToken = JWT.sign(tokenPayload, Config.ACCESS_TOKEN_SECRET_KEY, { expiresIn: Config.ACCESS_TOKEN_EXPIRE_TIME });
            const refreshToken = JWT.sign(tokenPayload, Config.REFRESH_TOKEN_SECRET_KEY, { expiresIn: Config.REFRESH_TOKEN_EXPIRE_TIME });

            const findToken = { refresh_token: sha1(userValidInputs.value.refresh_token) }
            const updateToken = { refresh_token: sha1(refreshToken) }

            AuthToken.findOneAndUpdate(findToken, updateToken)
            .then(success => {
                if(success) {

                    res.json({
                        success: true,
                        response: {
                            access_token: accessToken,
                            refresh_token: refreshToken
                        }
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

}

module.exports = component;