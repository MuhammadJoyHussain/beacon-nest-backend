const Vacancy = require('../models/Vacancy')
const Application = require('../models/Application')
const User = require('../models/User')

exports.getAdminStats = async (req, res) => {
  try {
    const totalJobs = await Vacancy.countDocuments()
    const activeJobs = await Vacancy.countDocuments({ status: 'active' })
    const totalApplications = await Application.countDocuments()
    const totalUsers = await User.countDocuments()

    const userCount = await User.countDocuments({ role: 'user' })
    const adminCount = await User.countDocuments({ role: 'admin' })

    res.json({
      totalJobs,
      activeJobs,
      totalApplications,
      totalUsers,
      userCount,
      adminCount,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
}
