const mongoose = require('mongoose');
const validator = require('validator')
const userRoles = require('../utils/user-roles')
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'invalid email address']
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    role: {
        default: userRoles.USER,
        type: String,
        enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER]
        
    }
})


module.exports = mongoose.model('User', UserSchema)