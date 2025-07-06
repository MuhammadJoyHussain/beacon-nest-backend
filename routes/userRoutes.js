const express = require('express')
const router = express.Router()
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

// Only regular user can access these
router.get('/profile', protect, authorizeRoles('user'), (req, res) => {
  res.json({ user: req.user })
})

router.get('/recommendation', protect, authorizeRoles('user'), (req, res) => {
  // Call your ML service here
  res.json({ jobs: [] })
})

router.get('/joblists', protect, authorizeRoles('user'), (req, res) => {
  // Return user's jobs
  res.json({ jobs: [] })
})

module.exports = router
