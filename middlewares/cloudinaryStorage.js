const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cv',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
    type: 'upload',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
})

module.exports = storage
