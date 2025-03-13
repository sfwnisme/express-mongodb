const mongoose = require("mongoose");
const validator = require('validatorjs');

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
    // validate: [validator.isEmail, "field must be a valid email"],
    // validate: {
    //   validator: (val) => {
    //     return validator.email(val);
    //   },
    //   message: "field must be a valid email",
    // }
  },
  password: {
    type: String,
    required: true,
  }
})
// Apply the uniqueValidator plugin
// userSchema.plugin(uniqueValidator, { message: '{PATH} already exists. Please use a different email.' });
module.exports = mongoose.model('User', userSchema)