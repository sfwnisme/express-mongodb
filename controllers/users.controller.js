const bcrypt = require('bcryptjs')
const User = require("../models/user.models.js")
const httpStatusText = require('../utils/httpStatusText.js')
const utils = require("../utils/utils.js")
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { request } = require('express')
const courseModels = require('../models/course.models.js')
const generateJWT = require('../utils/generateJWT.js')
const createPasswordHasher = require('../utils/createPasswordHasher.js')
const appError = new utils.AppError()

const hashPassword = createPasswordHasher(10)

const getAllUsers = asyncWrapper(
  async (req, res, next) => {
    const query = req.query
    const page = +query.page || 1;
    const limit = +query.limit || 2;
    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const allUsers = await User.find({}, { "__v": false, password: false }).limit(limit).skip(skip)
    if (!allUsers) {
      appError.create(404, httpStatusText.FAIL, 'no users found')
      return next(appError)
    }
    return res.status(200).json(
      utils.returnedResponse(
        httpStatusText.SUCCESS,
        { totalUsers, totalPages, currentPage: page, users: allUsers }
      ))
  })

const getSingleUser = asyncWrapper(
  async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId, { '__v': false, password: false })
    console.log("user available", user)
    if (!user) {
      appError.create(404, httpStatusText.FAIL, "user not found")
      return next(appError);
    }
    return res.json(utils.returnedResponse(httpStatusText.SUCCESS, user))
  })

const register = asyncWrapper(
  async (req, res, next) => {
    const isEmailRegistered = await User.findOne({ email: req.body.email })
    if (isEmailRegistered) {
      appError.create(400, httpStatusText.FAIL, "email already exists")
      return next(appError)
    }

    const hashedPassword = await hashPassword(req.body.password)

    const newUser = new User({ ...req.body, password: hashedPassword }, { '__v': false });
    const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role })
    const newUserWithToken = { data: newUser, token }
    console.log(newUser)
    await newUser.save();
    return res.status(201).json(utils.returnedResponse(httpStatusText.SUCCESS, newUserWithToken));
  })

const login = asyncWrapper(
  async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }, { "__v": false })
    if (!email) {
      appError.create(400, httpStatusText.FAIL, "email is required");
      return next(appError)
    }
    if (!password) {
      appError.create(400, httpStatusText.FAIL, "password is required");
      return next(appError)
    }
    if (!email && !password) {
      appError.create(400, httpStatusText.FAIL, "email and password is required");
      return next(appError)
    }
    if (!user) {
      appError.create(400, httpStatusText.FAIL, "email is not exist");
      return next(appError)
    };

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      appError.create(400, httpStatusText.FAIL, "password is not correct");
      return next(appError)
    }
    if (isPasswordMatch && user) {
      const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
      const userWithToken = { data: user, token: token }
      // user.token = token
      return res.status(200).json(utils.returnedResponse(200, userWithToken, "logged in successfully"))
    }
    // return res.status(200).json(utils.returnedResponse(httpStatusText.SUCCESS, user, "success"))
  })

const updateUser = asyncWrapper(
  async (req, res, next) => {
    let { body, params: { userId } } = req;
    const user = await User.findById(userId);

    if (!user) {
      appError.create(400, httpStatusText.FAIL, "user not found")
      return next(appError)
    }

    let updatedFields = { ...body }
    if (body.password) {

      // updatedFields.password = await bcrypt.hash(body.password, 10)
      updatedFields.password = await hashPassword(body.password)
    }

    console.log(updatedFields)

    const updatedUser = await User.updateOne({ _id: userId }, { ...updatedFields })
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

const deleteUser = asyncWrapper(
  async (req, res, next) => {
    const { userId } = req.params
    const getUser = await User.findOne({ _id: userId });

    if (!getUser) {
      appError.create(404, httpStatusText.FAIL, "user not found")
      return next(appError)
    }

    const deletedUser = await User.deleteOne({ _id: userId });
    return res.status(200).json(utils.returnedResponse(httpStatusText.SUCCESS, null, deletedUser))
  })

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  register,
  login,
  deleteUser
}