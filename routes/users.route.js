const express = require('express');
const router = express.Router()
const controllers = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const { userRoles } = require('../utils/userRoles');
const authorizeRole = require('../middlewares/authorizeRole');

// get all users
// register
// login
// get single user
// update user
// delete user

router.route('/')
  .get(verifyToken, authorizeRole(userRoles.MANAGER), controllers.getAllUsers)
router.route('/register')
  .post(controllers.register)
router.route('/login')
  .post(controllers.login)


router.route('/:userId')
  .get(verifyToken, authorizeRole(userRoles.MANAGER, userRoles.ADMIN), controllers.getSingleUser)
  .patch(controllers.updateUser)
  .delete(controllers.deleteUser)

module.exports = router
