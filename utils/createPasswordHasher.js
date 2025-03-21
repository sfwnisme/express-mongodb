const bcrypt = require('bcryptjs')
module.exports = (saltNumber) => {
  return async (password) => {
    return await bcrypt.hash(password, saltNumber)
  }
}