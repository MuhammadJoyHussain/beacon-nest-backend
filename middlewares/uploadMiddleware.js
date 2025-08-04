// middleware/uploadMiddleware.js
const multer = require('multer')
const cloudinaryStorage = require('./cloudinaryStorage')

const cloudinaryUpload = multer({ cloudinaryStorage })

module.exports = cloudinaryUpload
