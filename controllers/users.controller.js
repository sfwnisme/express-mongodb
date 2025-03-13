const { validationResult } = require('express-validator')
const User = require("../models/user.models.js")
const httpStatusText = require('../utils/httpStatusText.js')
const utils = require("../utils/utils.js")
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { request } = require('express')
const courseModels = require('../models/course.models.js')
const appError = new utils.AppError()

const getAllUsers = asyncWrapper(
  async (req, res, next) => {
    const query = req.query
    const page = +query.page || 1;
    const limit = +query.limit || 2;
    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const allUsers = await User.find({}, { "__v": false }).limit(limit).skip(skip)
    if (!allUsers) {
      appError.create(404, httpStatusText.FAIL, 'no users found')
      return next(appError)
    }
    return res.status(200).json(
      utils.returnedResponse(
        httpStatusText.SUCCESS,
        { totalUsers, totalPages, users: allUsers }
      ))
  })

const getSingleUser = asyncWrapper(
  async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId, { '__v': false })
    console.log("user available", user)
    if (!user) {
      appError.create(404, httpStatusText.FAIL, "user not found")
      return next(appError);
    }
    return res.json(utils.returnedResponse(httpStatusText.SUCCESS, user))
  })

const register = asyncWrapper(
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      ;
      console.log("====sfwn====", errors.errors)
      appError.create(404, httpStatusText.FAIL, errors.array())
      return next(appError)
    }
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json(utils.returnedResponse(httpStatusText.SUCCESS, newUser));
  })

const login = asyncWrapper(
  async (req, res, next) => {
    // const errors = validationResult(req);
    // console.log(errors)
    // if (!errors.isEmpty()) {
    //   ;
    //   console.log("====sfwn====", errors.errors)
    //   appError.create(404, httpStatusText.FAIL, errors.array())
    //   return next(appError)
    // }
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json(utils.returnedResponse(httpStatusText.SUCCESS, newUser));
  })

const updateUser = asyncWrapper(
  async (req, res, next) => {
    const { body, params: { userId } } = req;
    const user = await User.findById(userId);

    if (!user) {
      appError.create(400, httpStatusText.FAIL, "user not found")
      return next(appError)
    }

    const updatedUser = await User.updateOne({ _id: userId }, body)
    const isUpdated = updatedUser.modifiedCount > 0
    return res.status(200).json(
      utils
        .returnedResponse(
          httpStatusText.SUCCESS,
          updatedUser,
          isUpdated ? "updated successfully" : "no changes made"
        ))
  }
)

// const updateUser = asyncWrapper(
//   async (req, res, next) => {
//     const { body, params: { userId } } = req;
//     const existingUser = await User.findById(userId);
//     if (!existingUser) {

//       appError.create(404, httpStatusText.FAIL, "User not existed")
//       return next(appError)
//     }

//     const result = await User.updateOne({ _id: userId }, body);

//     if (result.modifiedCount > 0) {
//       return res.status(200).json(
//         utils.returnedResponse(httpStatusText.SUCCESS, result, "user updated successfully")
//       )
//     } else {
//       return res.status(200).json(
//         utils.returnedResponse(httpStatusText.SUCCESS, result, "no changes are made to the user")
//       )
//     }
//   })

// const deleteUser = asyncWrapper(
//   async (req, res, next) => {
//     const userId = req.params.userId;
//     const userById = await User.findById(userId)


//     if (!userById) {
//       appError.create(404, httpStatusText.FAIL, "user not exist")
//       return next(appError)
//     }

//     const user = await User.deleteOne({ _id: userId })
//     return res.status(204).json(utils.returnedResponse(httpStatusText.SUCCESS, user))
//   })

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  register,
  login,
}