const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cv', // this will appear in your Cloudinary folder
    resource_type: 'raw', // required for non-images
    allowed_formats: ['pdf', 'doc', 'docx'],
    type: 'upload',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
})

module.exports = storage
