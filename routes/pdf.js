// routes/pdfRoutes.js
const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')
const { parsePdf } = require('../controllers/pdfController')

router.post('/upload', upload.single('pdf'), parsePdf)

module.exports = router
