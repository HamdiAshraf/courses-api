
const { Router } = require('express')
const { getAllCourses, getCourse, createCourse ,editCourse,deleteCourse} = require('../controllers/courses.controller')
const { validateCourseBody } = require('../middlewares/courses.validation')
const router = Router();


router.route('/').get(getAllCourses).post(validateCourseBody(), createCourse)

router.route('/:courseId').get(getCourse).patch(editCourse).delete(deleteCourse)
module.exports = router;