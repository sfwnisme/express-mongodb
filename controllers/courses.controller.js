const { validationResult } = require('express-validator')
const Course = require("../models/course.models.js")
const httpStatusText = require('../utils/httpStatusText.js')
const { ObjectId } = require("mongoose").Types
const utils = require("../utils/utils.js")
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { isValidObjectId } = require('mongoose')
const appError = new utils.AppError()
const getAllCourses = asyncWrapper(
  async (req, res, next) => {
    const query = req.query
    const page = +query.page || 1;
    const limit = +query.limit || 2;
    const skip = (page - 1) * limit;
    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);
    const allCourses = await Course.find({}, { "__v": false }).limit(limit).skip(skip)
    if (!allCourses) {
      appError.create(404, httpStatusText.FAIL, 'no courses found')
      return next(appError)
    }
    return res.status(200).json(
      utils.returnedResponse(
        httpStatusText.SUCCESS,
        { totalCourses, totalPages, courses: allCourses }
      ))
  })

const getSingleCourse = asyncWrapper(
  async (req, res, next) => {
    const { courseId } = req.params
    const course = await Course.findById(courseId)
    console.log("course available", course)
    if (!course) {
      appError.create(404, httpStatusText.FAIL, "course not found")
      return next(appError);
    }
    return res.json(utils.returnedResponse(httpStatusText.SUCCESS, course))
  })

const addNewCourse = asyncWrapper(
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      ;
      console.log("====sfwn====", errors.errors)
      appError.create(404, httpStatusText.FAIL, errors.array())
      return next(appError)
    }
    const newCourse = new Course(req.body);
    await newCourse.save();
    return res.status(201).json(utils.returnedResponse(httpStatusText.SUCCESS, newCourse));
  })

const updateCourse = asyncWrapper(
  async (req, res, next) => {
    const { body, params: { courseId } } = req;
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {

      appError.create(404, httpStatusText.FAIL, "Course not existed")
      return next(appError)
    }

    const result = await Course.updateOne({ _id: courseId }, body);

    if (result.modifiedCount > 0) {
      return res.status(200).json(
        utils.returnedResponse(httpStatusText.SUCCESS, result, "course updated successfully")
      )
    } else {
      return res.status(200).json(
        utils.returnedResponse(httpStatusText.SUCCESS, result, "no changes are made to the course")
      )
    }
  })

const deleteCourse = asyncWrapper(
  async (req, res, next) => {
    const courseId = req.params.courseId;
    const courseById = await Course.findById(courseId)


    if (!courseById) {
      appError.create(404, httpStatusText.FAIL, "course not exist")
      return next(appError)
    }

    const course = await Course.deleteOne({ _id: courseId })
    return res.status(204).json(utils.returnedResponse(httpStatusText.SUCCESS, course))
  })

module.exports = {
  getAllCourses,
  getSingleCourse,
  addNewCourse,
  updateCourse,
  deleteCourse
}