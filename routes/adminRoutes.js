const express = require('express')
const router = express.Router()
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const User = require('../models/User')
const {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require('../controllers/userController')
const { getAdminStats } = require('../controllers/adminStatController')

// Admin Dashboard Stats
router.get('/stats', protect, authorizeRoles('admin'), getAdminStats)

// Manage Users
router.get('/users', protect, authorizeRoles('admin'), getAllUsers)

// Update user by admin
router.put('/users/:id', protect, authorizeRoles('admin'), updateUserByAdmin)

// Delete user by admin
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUserByAdmin)

// Manage Candidates (filter by role or other condition)
router.get(
  '/candidates',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    const candidates = await User.find({ role: 'user' }).select('-password')
    res.json(candidates)
  }
)

// Manage Jobs (add your Job model)
router.get('/jobs', protect, authorizeRoles('admin'), async (req, res) => {
  const jobs = await Job.find()
  res.json(jobs)
})

router.post(
  '/jobs/post',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    const { title, description } = req.body
    const job = await Job.create({ title, description, postedBy: req.user._id })
    res.status(201).json(job)
  }
)

// Admin Reports (mock)
router.get('/reports', protect, authorizeRoles('admin'), async (req, res) => {
  // In real life, gather analytics here
  res.json({ message: 'Report data coming soon' })
})

module.exports = router
