require('dotenv').config();
const express = require('express')
const mongoose = require("mongoose")
const app = express()
app.use(express.json())
const port = 5000;
const httpStatusText = require("./utils/httpStatusText")
const { returnedResponse } = require('./utils/utils');
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const cors = require('cors')

app.use(cors())
//-------------------------
// mongooes connection
//-------------------------
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "courses"
}).then(() => {
  console.log('01- mongodb server started')
})

//-------------------------
// routes setup
//-------------------------
app.use('/api/courses', coursesRouter)
app.use('/api/users', usersRouter)

//-------------------------
// global middleware for not found routes
//-------------------------
app.all("*", (req, res, next) => {
  res.status(404).json(returnedResponse(httpStatusText.ERROR, null, "page not found"))
})

//-------------------------
// global error handler
// handle the returned error for the entire application using the following middleware.
//-------------------------
app.use((error, req, res, next) => {
  console.log("server error:", error)
  const objectIdError = error.name == "CastError" && error.kind === "ObjectId"
  res.status(error.statusCode || 500).json(
    returnedResponse(
      error.statusText || httpStatusText.ERROR,
      error.data || null,
      !objectIdError ? error : "The Id is not valid"
    ))
})

app.listen(port, () => { console.log('listened') })
