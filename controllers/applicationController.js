// controllers/applicationController.js
const Application = require('../models/Application')
const User = require('../models/User')

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).populate(
      'job'
    )
    res.json(applications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch applications' })
  }
}

exports.submitApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const {
      jobId,
      coverLetter,
      additionalInfo,
      expectedSalary,
      startDate,
      linkedIn,
      experienceYears,
      authorized,
    } = req.body

    // 🔒 Check if the user already applied to this job
    const existingApplication = await Application.findOne({
      user: user._id,
      job: jobId,
    })

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied to this job.',
      })
    }

    // ✅ Create new application
    const application = await Application.create({
      user: user._id,
      job: jobId,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      coverLetter,
      additionalInfo,
      expectedSalary,
      startDate,
      linkedIn,
      experienceYears,
      authorized,
    })

    res.status(201).json({ message: 'Application submitted', application })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error. Try again later.' })
  }
}
