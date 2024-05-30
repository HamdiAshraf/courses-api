const { validationResult } = require('express-validator')

const Course = require('../models/Course')

const httpStatusText = require('../utils/httpStatusText')

exports.getAllCourses = async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses } });
}


exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ status: httpStatusText.FAIL, data: { "course": "course not found" } })
        }

        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } })
    } catch (err) {
        return res.status(400).json({ status: httpStatusText.ERROR, message: "invalid object id" })

    }
}



exports.createCourse = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: errors.array() })
    }
    try {
        const newCourse = new Course({ ...req.body });
        await newCourse.save();
        return res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
    } catch (err) {
        return res.status(400).json({ status: httpStatusText.ERROR, message: "invalid object id" });
    }
}



exports.editCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate({ _id: req.params.courseId }, { $set: req.body }, { new: true })

        if (!course) {
            return res.status(404).json({ status: httpStatusText.FAIL, data: { "course": "course not found" } })
        }


        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } })
    } catch (err) {
        return res.status(400).json({ status: httpStatusText.ERROR, message: "invalid object id" })

    }
}


exports.deleteCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ status: httpStatusText.FAIL, data: { "course": "course not found" } });
        }

        await Course.findByIdAndDelete(req.params.courseId);

        return res.status(204).send({ status: httpStatusText.SUCCESS, data: null });
    } catch (err) {
        return res.status(400).json({ status: httpStatusText.ERROR, message: "invalid object id" });
    }
}
