const express = require('express')
const router = express.Router()
const {
  getCoursesBySkills,
  createCoursesBySkills,
} = require('../controllers/courseController')

router.get('/', getCoursesBySkills)
router.post('/', createCoursesBySkills)

module.exports = router
