module.exports = (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((error) => {
      next(error)
    });
  }
}

// catch any controller's error.
// avoid errors catch block duplication.