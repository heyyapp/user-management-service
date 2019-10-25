const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const sha1 = require('sha1');

const Config = require('./../config');

require('./../models/user');
require('./../models/auth_token');
const User = mongoose.model('users');
const AuthToken = mongoose.model('auth_tokens');

const component = (req, res) => {

    const userSchema = {
        email: Joi.string().email().required(),
        password: Joi.string().required()
    };

    const userValidInput = Joi.validate(req.body, userSchema);

    if (userValidInput.error) {
        res.json(userValidInput.error.name);
    }

    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                res.send('User not found.');
            }

            else {
                bcrypt.compare(userValidInput.value.password, user.password, (err, success) => {
                    if (success) {

                        const tokenPayload = {
                            user_id: user._id,
                        }

                        const accessToken = JWT.sign(tokenPayload, Config.ACCESS_TOKEN_SECRET_KEY, { expiresIn: Config.ACCESS_TOKEN_EXPIRE_TIME });
                        const refreshToken = JWT.sign(tokenPayload, Config.REFRESH_TOKEN_SECRET_KEY, { expiresIn: Config.REFRESH_TOKEN_EXPIRE_TIME });

                        const authTokenSchema = {
                            _user_id: user._id,
                            refresh_token: sha1(refreshToken)
                        }

                        new AuthToken(authTokenSchema)
                            .save()
                            .then(token => {

                                if (token) {
                                    res.json({
                                        success: true,
                                        response: {
                                            access_token: accessToken,
                                            refresh_token: refreshToken
                                        }
                                    });
                                }

                                else {
                                    res.json({ error: false });
                                }
                            })
                    }

                    else {
                        res.json({
                            success: false,
                            res: "InvalidPassword"
                        });
                    }
                });
            }

        });

}

module.exports = component;