const express = require('express')
const router = express.Router()
const {
  getVacancy,
  createVacancies,
  createVacancy,
  getVacancyById,
  deleteManyVacancy,
  deleteVacancy,
  getRecommendations,
  getVacanciesByEmployer,
} = require('../controllers/vacancyController')
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')

router.get('/', getVacancy)
router.get('/:id', protect, authorizeRoles('employer'), getVacanciesByEmployer)
router.post('/recommend', getRecommendations)
router.post('/', createVacancies)
router.post('/', createVacancy)
router.delete('/', deleteManyVacancy)
router.get('/:id', getVacancyById)
router.delete('/:id', deleteVacancy)

module.exports = router
