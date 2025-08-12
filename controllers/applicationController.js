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

exports.getApplications = async (req, res) => {
  try {
    const application = await Application.find()
      .populate('user', '-password')
      .populate('job')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    res.status(200).json(application)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch application' })
  }
}

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findById(id)
      .populate('user', '-password')
      .populate('job')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

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

exports.getApplicantsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const employerId = req.user._id

    const job = await Vacancy.findById(jobId)

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    if (job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view applicants for this job',
      })
    }

    const applications = await Application.find({ job: jobId })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: applications.length,
      applicants: applications,
    })
  } catch (err) {
    console.error('Error fetching applicants:', err)
    res.status(500).json({ success: false, message: 'Server Error' })
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

    if (
      req.user.role !== 'admin' &&
      application.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    const jobSkills = application.job.skills || []
    const userSkills = application.user.skills || []

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

exports.updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params

    const application = await Application.findById(applicationId)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

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
      status: req.body.status,
    }

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

exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params

    const application = await Application.findById(applicationId)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

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
