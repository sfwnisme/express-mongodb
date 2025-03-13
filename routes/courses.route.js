const express = require('express');
const router = express.Router()
const controllers = require('../controllers/courses.controller')
const createCourseValidation = require('../middlewares/validationSchema')

router.route('/')
  .get(controllers.getAllCourses)
  .post(
    createCourseValidation(),
    controllers.addNewCourse
  )

router.route('/:courseId')
  .get(controllers.getSingleCourse)
  .patch(controllers.updateCourse)
  .delete(controllers.deleteCourse)

module.exports = router
