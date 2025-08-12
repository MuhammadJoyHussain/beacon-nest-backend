const express = require('express')
const router = express.Router()
const {
  recommendJobsForUser,
  recommendCandidatesForEmployer,
} = require('../controllers/recommendationController')
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

router.get('/:id', protect, recommendJobsForUser)

router.get(
  '/user/:jobId',
  protect,
  authorizeRoles('employer'),
  recommendCandidatesForEmployer
)

module.exports = router
