const express = require('express');
const router = express.Router()
const controllers = require('../controllers/users.controller')

// get all users
// register
// login
// get single user
// update user
// delete user

router.route('/')
  .get(controllers.getAllUsers)
router.route('/register')
  .post(controllers.register)
router.route('/login')
  .post(controllers.login)


router.route('/:userId')
  .get(controllers.getSingleUser)
  .patch(controllers.updateUser)

module.exports = router
