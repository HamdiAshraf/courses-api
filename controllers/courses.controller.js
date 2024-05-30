const { validationResult } = require('express-validator')

const mongoose = require('mongoose')
const Course = require('../models/Course')
const appError = require('../utils/appError')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')

exports.getAllCourses = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses } });
}
)

exports.getCourse = asyncWrapper(async (req, res, next) => {
    const courseId = req.params.courseId;


    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(appError.create('Invalid course ID format', 400, httpStatusText.FAIL));
    }

    const course = await Course.findById(courseId);

    if (!course) {
        return next(appError.create('Course not found', 404, httpStatusText.FAIL));
    }

    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } });
});



exports.createCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(appError.create(errors.array().map(err => err.msg).join(', '), 400, httpStatusText.FAIL));
    }

    const newCourse = new Course({ ...req.body });
    await newCourse.save();
    return res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

exports.editCourse = asyncWrapper(async (req, res, next) => {

    const course = await Course.findByIdAndUpdate({ _id: req.params.courseId }, { $set: req.body }, { new: true })
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
        return next(appError.create('Invalid course ID format', 400, httpStatusText.FAIL));
    }
    if (!course) {
        return next(appError.create('Course not found', 404, httpStatusText.FAIL));

    }


    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } })
}




)

exports.deleteCourse = asyncWrapper(async (req, res, next) => {

    let course = await Course.findById(req.params.courseId);
    if (!course) {
        return res.status(404).json({ status: httpStatusText.FAIL, data: { "course": "course not found" } });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
        return next(appError.create('Invalid course ID format', 400, httpStatusText.FAIL));
    }

    await Course.findByIdAndDelete(req.params.courseId);

    return res.status(204).send({ status: httpStatusText.SUCCESS, data: null });



})
