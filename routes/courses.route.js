
const { Router } = require('express')
const { getAllCourses, getCourse, createCourse, editCourse, deleteCourse } = require('../controllers/courses.controller')
const { validateCourseBody } = require('../middlewares/courses.validation')
const { verifyToken } = require('../middlewares/verifyToken')
const { allowedTo } = require('../middlewares/allowedTo')
const userRoles = require('../utils/user-roles')

const router = Router();


router.route('/').get(getAllCourses).post(validateCourseBody(), verifyToken, allowedTo(userRoles.MANAGER), createCourse)

router.route('/:courseId').get(getCourse).patch(verifyToken, editCourse).delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), deleteCourse)
module.exports = router;