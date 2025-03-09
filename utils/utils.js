function returnedResponse(status, data, msg) {
  console.log("returned response function fired")
  return { status, data, msg }
}

function returnedError(statusCode, statusText, message) {
  const error = new Error();
  error.statusCode = statusCode
  error.statusText = statusText
  error.message = message;
  return error
}

class AppError extends Error {
  create(statusCode, statusText, message) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.message = message;
    return this
  }
}

module.exports = { returnedResponse, returnedError, AppError }