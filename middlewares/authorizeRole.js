const utils = require('../utils/utils')
const httpStatusText = require('../utils/httpStatusText')
const appError = new utils.AppError()

module.exports = (...roles) => {
  console.log("current roles", roles)
  return (req, res, next) => {
    try {
      console.log(req.body)
      if (!roles.includes(req.body.user.role)) {
        appError.create(403, httpStatusText.FAIL, "fobedden, you can not access this route")
        return next(appError)
      }
      console.log("access accepted")
      return next()
    } catch (error) {
      appError.create(error.status, httpStatusText.ERROR)
      return next(error)
    }
  }
}