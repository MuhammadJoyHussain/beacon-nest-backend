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
} = require('../controllers/vacancyController')

router.get('/', getVacancy)
router.post('/recommend', getRecommendations)
router.post('/', createVacancies)
router.post('/', createVacancy)
router.delete('/', deleteManyVacancy)
router.get('/:id', getVacancyById)
router.delete('/:id', deleteVacancy)

module.exports = router
