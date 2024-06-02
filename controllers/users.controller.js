const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const appError = require('../utils/appError')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const { generateToken } = require('../utils/generateToken')


exports.getAllUsers = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } });
}
)



exports.register = asyncWrapper(async (req, res, next) => {
    
    const { firstName, lastName, email, password, role, avatar } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(appError.create(errors.array().map(err => err.msg).join(', '), 400, httpStatusText.FAIL));
    }

    const existUser = await User.findOne({ email })
    if (existUser) {
        return next(appError.create('user already exist', 400, httpStatusText.FAIL));
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    })
    const token = await generateToken({ email: newUser.email, id: newUser._id, role: newUser.role })
    newUser.token = token;
    await newUser.save();

    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { newUser } })

})




exports.login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return next(appError.create('email must be provided', 400, httpStatusText.FAIL));

    if (!password) return next(appError.create('password must be provided', 400, httpStatusText.FAIL));
    if (!email && !password) return next(appError.create('email and password must be provided', 400, httpStatusText.FAIL));


    const user = await User.findOne({ email });
    if (!user) {
        return next(appError.create('incorrect email', 404, httpStatusText.FAIL));
    }


    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) return next(appError.create('incorrect password', 400, httpStatusText.FAIL));

    const token = await generateToken({ email: user.email, id: user._id, role: user.role })



    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { token: token } })





})