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

// Get a single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findById(id)
      .populate('user', '-password')
      .populate('job')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // Allow only the applicant or admin to view
    if (
      req.user.role !== 'admin' &&
      application.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    res.status(200).json(application)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch application' })
  }
}

exports.getSkillGap = async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findById(id)
      .populate('user', '-password')
      .populate('job')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      application.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    const jobSkills = application.job.skills || []
    const userSkills = application.user.skills || []

    // Case-insensitive comparison
    const normalizedUserSkills = userSkills.map((skill) =>
      skill.toLowerCase().trim()
    )
    const skillGap = jobSkills.filter(
      (skill) => !normalizedUserSkills.includes(skill.toLowerCase().trim())
    )

    res.status(200).json({ skillGap })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to calculate skill gap' })
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

    const cvUrl = req.file ? req.file.path : null

    const existingApplication = await Application.findOne({
      user: user._id,
      job: jobId,
    })

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied to this job.',
      })
    }

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
      cv: cvUrl,
    })

    res.status(201).json({ message: 'Application submitted', application })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error. Try again later.' })
  }
}

// Get all applications (admin/recruiter)
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params

    const applications = await Application.find({ job: jobId })
      .populate('user', '-password')
      .populate('job')

    res.status(200).json(applications)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch job applications' })
  }
}

// Update an application (admin or user)
exports.updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params

    const application = await Application.findById(applicationId)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // Optionally: Only allow admin or the applicant to update
    if (
      req.user.role !== 'admin' &&
      application.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    const updates = {
      coverLetter: req.body.coverLetter,
      additionalInfo: req.body.additionalInfo,
      expectedSalary: req.body.expectedSalary,
      startDate: req.body.startDate,
      linkedIn: req.body.linkedIn,
      experienceYears: req.body.experienceYears,
      authorized: req.body.authorized,
      status: req.body.status, // e.g., pending/approved/rejected
    }

    // Only update fields that were sent
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        application[key] = updates[key]
      }
    })

    await application.save()

    res.status(200).json({ message: 'Application updated', application })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update application' })
  }
}

// Delete an application (admin or the applicant)
exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params

    const application = await Application.findById(applicationId)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // Optional: Only allow admin or the applicant to delete
    if (
      req.user.role !== 'admin' &&
      application.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await application.deleteOne()

    res.status(200).json({ message: 'Application deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete application' })
  }
}
