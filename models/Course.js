// models/Course.js
const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  courses: [
    {
      title: String,
      url: String,
      provider: String,
    },
  ],
})

module.exports = mongoose.model('Course', courseSchema)
