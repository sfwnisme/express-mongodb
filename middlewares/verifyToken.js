const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/utils');
const httpStatusText = require('../utils/httpStatusText')
const appError = new AppError
module.exports = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization']

  if (!authHeader) {
    appError.create(401, httpStatusText.FAIL, 'unauthorized, token is required')
    return next(appError)
  }
  const token = authHeader.split(' ')[1]
  console.log(token)
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY)
    next()
  } catch (error) {
    appError.create(401, httpStatusText.ERROR, 'unauthorized, token is not valid')
    return next(appError)
  }
}