// controllers/pdfController.js
const fs = require('fs')
const pdfParse = require('pdf-parse')
const {
  extractFullName,
  extractEmail,
  extractPhone,
  extractStreetAndCity,
  extractExperience,
  extractEducation,
} = require('../utils/extractor')

const parsePdf = async (req, res) => {
  const file = req.file

  if (!file) return res.status(400).json({ error: 'No file uploaded' })

  try {
    const dataBuffer = fs.readFileSync(file.path)
    const pdfData = await pdfParse(dataBuffer)
    const text = pdfData.text

    const fullName = extractFullName(text)
    const [firstName = '', ...rest] = fullName.split(' ')
    const lastName = rest.join(' ')

    const email = extractEmail(text)
    const phone = extractPhone(text)
    const { street, city } = extractStreetAndCity(text)

    const employeeExperience = extractExperience(text)
    console.log(employeeExperience)

    const education = extractEducation(text)
    console.log(education)

    fs.unlinkSync(file.path)

    res.json({
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      employeeExperience,
      education,
    })
  } catch (err) {
    console.error('Error parsing PDF:', err)
    res.status(500).json({ error: 'Failed to process PDF' })
  }
}

module.exports = { parsePdf }
