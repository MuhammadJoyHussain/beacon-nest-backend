const express = require('express')
const router = express.Router()
const {
  recommendJobsForUser,
  recommendCandidatesForEmployer,
} = require('../controllers/recommendationController')
const { authorizeRoles } = require('../middlewares/authMiddleware')

router.get('/:id', protect, authorizeRoles('user'), recommendJobsForUser)

router.get(
  '/',
  protect,
  authorizeRoles('admin'),
  recommendCandidatesForEmployer
)
