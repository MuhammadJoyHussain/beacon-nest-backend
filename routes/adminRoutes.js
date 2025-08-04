const express = require('express')
const router = express.Router()
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const User = require('../models/User')
const {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require('../controllers/authConrtoller')
const { getAdminStats } = require('../controllers/adminStatController')

router.get('/stats', protect, authorizeRoles('admin'), getAdminStats)

router.get('/users', protect, authorizeRoles('admin'), getAllUsers)

router.put('/users/:id', protect, authorizeRoles('admin'), updateUserByAdmin)

router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUserByAdmin)

router.get(
  '/candidates',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    const candidates = await User.find({ role: 'user' }).select('-password')
    res.json(candidates)
  }
)

module.exports = router
