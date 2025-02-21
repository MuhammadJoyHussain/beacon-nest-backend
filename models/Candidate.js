const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    description: { type: String },
    skills: [{ type: String }],
    location: { type: String },
    rate: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Candidate', candidateSchema)
