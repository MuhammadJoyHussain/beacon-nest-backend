const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  updateUserProfile,
  recommendJobsForUser,
} = require('../controllers/userController')

const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

// Public
router.post('/register', registerUser)
router.post('/login', loginUser)

// Protected
router.get('/profile', protect, (req, res) => {
  res.json(req.user)
})
router.put('/profile', protect, updateUserProfile)
router.get(
  '/recommend/:id',
  protect,
  // authorizeRoles('user'),
  recommendJobsForUser
)

module.exports = router
