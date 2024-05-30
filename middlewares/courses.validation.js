const { body } = require('express-validator')
exports.validateCourseBody = () => {
    return [
        body('title').notEmpty().withMessage('title must be provided')
            .isLength({ min: 2 }).withMessage('length must be at least two characters'),

        body('price').notEmpty().withMessage('price must be provided')
    ]
}