// middleware/uploadMiddleware.js
const multer = require('multer')

const upload = multer({ dest: 'upload' })

module.exports = upload
