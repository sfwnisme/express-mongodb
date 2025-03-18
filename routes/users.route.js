const express = require('express');
const router = express.Router()
const controllers = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');

// get all users
// register
// login
// get single user
// update user
// delete user

router.route('/')
  .get(verifyToken, controllers.getAllUsers)
router.route('/register')
  .post(controllers.register)
router.route('/login')
  .post(controllers.login)


router.route('/:userId')
  .get(verifyToken, controllers.getSingleUser)
  .patch(controllers.updateUser)
  .delete(controllers.deleteUser)

module.exports = router
