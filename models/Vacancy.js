const mongoose = require('mongoose')

const VacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract'],
    default: 'Full-Time',
  },
  salary: { type: String, required: true },
  skills: [{ type: String, required: true }],
  department: { type: String, required: true },
  companyOverview: { type: String },
  jobSummary: { type: String },
  keyResponsibilities: [{ type: String }],
  requiredQualifications: [{ type: String }],
  preferredQualifications: [{ type: String }],
  benefits: [{ type: String }],
  howToApply: { type: String },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Vacancy', VacancySchema)
