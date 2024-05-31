require('dotenv').config()
const jwt = require('jsonwebtoken');


exports.generateToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1m' })
    return token;
}