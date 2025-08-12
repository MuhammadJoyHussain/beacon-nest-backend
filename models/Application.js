const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vacancy',
      required: true,
    },
    cv: {
      type: String,
      required: false,
    },
    status: { type: String, default: 'Under Review' },
    coverLetter: String,
    additionalInfo: String,
    expectedSalary: Number,
    startDate: Date,
    linkedIn: String,
    experienceYears: Number,
    authorized: Boolean,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Application', applicationSchema)
