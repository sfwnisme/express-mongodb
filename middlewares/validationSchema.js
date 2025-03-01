const { body } = require("express-validator")

const createCourseValidation = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('title is required')
      .isLength({ min: 2 })
      .withMessage('title should be at least 2 characters')
    ,
    body('price')
      .notEmpty()
      .withMessage('price is required')
  ]
}

module.exports = createCourseValidation