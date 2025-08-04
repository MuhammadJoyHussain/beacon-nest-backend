const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multerUpload')
const { parsePdf } = require('../controllers/pdfController')
const cloudinaryUpload = require('../middlewares/uploadMiddleware')

router.post('/upload', upload.single('pdf'), parsePdf)

module.exports = router
