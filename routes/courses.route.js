
const { Router } = require('express')
const { getAllCourses, getCourse, createCourse, editCourse, deleteCourse } = require('../controllers/courses.controller')
const { validateCourseBody } = require('../middlewares/courses.validation')
const { verifyToken } = require('../middlewares/verifyToken')

const router = Router();


router.route('/').get(getAllCourses).post(validateCourseBody(), verifyToken, createCourse)

router.route('/:courseId').get(getCourse).patch(editCourse).delete(deleteCourse)
module.exports = router;