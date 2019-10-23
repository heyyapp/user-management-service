const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

require('./../models/user');
const User = mongoose.model('users');

const component = (req, res) => {

    const userSchema = {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    };

    const userValidInput = Joi.validate(req.body, userSchema);

    if (userValidInput.error) {
        res.json(userValidInput.error.name);
    }

    let userName = userValidInput.value.email.split('@');
    userName = userName[0] + userName[1].substring(0, 1);

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(userValidInput.value.password, salt, (err, hash) => {
            if (err) throw err;

            const newUser = {
                name: userValidInput.value.name,
                user_name: userName,
                email: userValidInput.value.email,
                password: hash
            }

            User.findOne({ email: userValidInput.value.email })
                .then(user => {

                    if (user) {
                        res.json({
                            success: false,
                            response: 'AlreadyExist'
                        });
                    }

                    else {
                        new User(newUser)
                            .save()
                            .then(() => {
                                res.json({
                                    success: true
                                });
                            })
                    }

                });

        });
    });

}

module.exports = component;