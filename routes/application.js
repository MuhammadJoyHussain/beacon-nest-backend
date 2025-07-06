// routes/applicationRoutes.js
const express = require('express')
const router = express.Router()
const {
  getMyApplications,
  submitApplication,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController')
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

router.get('/my', protect, getMyApplications)
router.post('/', protect, submitApplication)
router.get(
  '/job/:jobId',
  protect,
  authorizeRoles('admin'),
  getApplicationsByJob
)

router.put(
  '/:applicationId',
  protect,
  authorizeRoles('admin'),
  updateApplication
)

router.delete(
  '/:applicationId',
  protect,
  authorizeRoles('admin'),
  deleteApplication
)

module.exports = router
