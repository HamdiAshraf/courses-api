const { body } = require('express-validator')
exports.validateRegister = () => {
    return [
        body('firstName').notEmpty().withMessage('firstName must be provided')
        ,

        body('lastName').notEmpty().withMessage('lastName must be provided'),


        body('email').notEmpty().withMessage('email must be provided')
            .isEmail().withMessage('invalid email address'),

        body('password').notEmpty().withMessage('password must be provided')
            .isLength({ min: 6 }).withMessage('password must be at least 6 characters')

    ]
}