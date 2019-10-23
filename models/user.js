const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;