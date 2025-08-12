const express = require('express')
const router = express.Router()
const {
  getVacancy,
  createVacancy,
  getVacancyById,
  deleteManyVacancy,
  deleteVacancy,
  getRecommendations,
  getVacanciesByEmployer,
} = require('../controllers/vacancyController')
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

router.get('/', getVacancy)
router.get(
  '/employer/:id',
  protect,
  authorizeRoles('employer'),
  getVacanciesByEmployer
)
router.get('/:id', getVacancyById)
router.post('/recommend', getRecommendations)
router.post('/', createVacancy)
router.delete('/', deleteManyVacancy)
router.delete('/:id', deleteVacancy)

module.exports = router
