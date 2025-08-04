// controllers/recommendationController.js
const axios = require('axios')
const User = require('../models/User')
const Job = require('../models/Job') // Assuming you have a Job model

// Recommend jobs for a candidate based on their skills
exports.recommendJobsForUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const response = await axios.post(
      'https://recommendar-37ri.onrender.com/recommend',
      {
        skills: user.skills,
      }
    )

    res.json(response.data)
  } catch (error) {
    console.error('Error recommending jobs for user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Recommend candidates for an employer based on job requirements
exports.recommendCandidatesForEmployer = async (req, res) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const response = await axios.post(
      'https://recommendar-37ri.onrender.com/recommend-user',
      {
        skills: job.skills,
      }
    )

    res.json(response.data)
  } catch (error) {
    console.error('Error recommending candidates:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
