const { validationResult } = require('express-validator')
const courses = require('../data/courses')
const Course = require("../models/course.models.js")
const { ObjectId } = require("mongoose").Types

const getAllCourses = async (req, res) => {
  const allCourses = await Course.find()
  return res.status(200).json(allCourses)
}

const getSingleCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId)
    console.log("sfwn Id", ObjectId.isValid(courseId))
    // if (!course) {
    //   return res.status(404).json({
    //     status: "error",
    //     message: `the course with ID:[${courseId}] is not exist, try another one`
    //   })
    // }

    return res.json(course)

  } catch (error) {
    console.log('error', error)
    return res.json(error)
  }
}

const addNewCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  return res.status(201).json(newCourse);
}

const updateCourse = async (req, res) => {
  try {

    const { body, params: { courseId } } = req;
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        status: "error",
        message: `Course with ID: ${courseId} not found`,
      })
    }

    const result = await Course.updateOne({ _id: courseId }, body);

    if (result.modifiedCount > 0) {
      return res.status(200).json({
        status: "success",
        message: "Course Updated Successfully",
        data: result
      })
    } else {
      return res.status(200).json({
        status: "success",
        message: "No changes are made to the course",
        data: result
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Faild to update course",
      detials: error.message
    })
  }
}

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.deleteONe({_id:courseId})
  return res.status(204).json(course)
}

module.exports = {
  getAllCourses,
  getSingleCourse,
  addNewCourse,
  updateCourse,
  deleteCourse
}