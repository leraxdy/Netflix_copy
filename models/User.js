const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: String,

    email: String,

    password: String

});

// ВАЖНО:
module.exports = mongoose.model('users', UserSchema);