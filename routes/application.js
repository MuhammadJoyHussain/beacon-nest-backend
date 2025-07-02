// routes/applicationRoutes.js
const express = require('express')
const router = express.Router()
const {
  getMyApplications,
  submitApplication,
} = require('../controllers/applicationController')
const { protect } = require('../middlewares/authMiddleware')

router.get('/my', protect, getMyApplications)
router.post('/', protect, submitApplication)

module.exports = router
