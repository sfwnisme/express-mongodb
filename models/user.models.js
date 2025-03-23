const mongoose = require("mongoose");
const validator = require('validator');
const { userRoles } = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: [validator.isEmail, "field must be a valid email"],
    // validate: {
    //   validator: (val) => {
    //     const validation = new validator({ email: val }, { email: "required|email" });
    //     return validation.passes();
    //     // return validator.email(val);
    //   },
    //   message: "field must be a valid email",
    // }
  },
  password: {
    type: String,
    required: true,
  },
  // token: {
  //   type: String
  // },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER],
    default: userRoles.USER
  }
})
// Apply the uniqueValidator plugin
// userSchema.plugin(uniqueValidator, { message: '{PATH} already exists. Please use a different email.' });
module.exports = mongoose.model('User', userSchema)