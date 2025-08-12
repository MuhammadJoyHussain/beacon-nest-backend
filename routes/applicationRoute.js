const express = require('express')
const router = express.Router()
const {
  getMyApplications,
  submitApplication,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
  getApplicationById,
  getSkillGap,
  getApplications,
} = require('../controllers/applicationController')
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const cloudinaryUpload = require('../middlewares/uploadMiddleware')

router.get('/', getApplications)
router.get('/my', protect, getMyApplications)
router.get('/:id', protect, getApplicationById)

router.get('/:id/skill-gap', protect, getSkillGap)
router.post('/', protect, cloudinaryUpload.single('cv'), submitApplication)
router.get('/job/:jobId', getApplicationsByJob)

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
