const express = require('express')
const router = express.Router()
const candidateController = require('../controllers/candidateController')

router.get('/', candidateController.getCandidates)
router.get('/:id', candidateController.getCandidate)
router.post('/', candidateController.createCandidates)
router.post('/', candidateController.createCandidate)
router.put('/:id', candidateController.updateCandidate)
router.delete('/:id', candidateController.deleteCandidate)

module.exports = router
