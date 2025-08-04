const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

module.exports = upload
