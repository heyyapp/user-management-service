const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authTokenSchema = new Schema({
    _user_id: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const AuthToken = mongoose.model('auth_tokens', authTokenSchema);
module.exports = AuthToken;