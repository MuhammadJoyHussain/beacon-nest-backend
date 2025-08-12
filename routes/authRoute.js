const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getAllUsers,
} = require('../controllers/authConrtoller')

const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

router.get('/', getAllUsers)

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/profile', protect, (req, res) => {
  res.json(req.user)
})
router.put('/profile', protect, updateUserProfile)

module.exports = router
