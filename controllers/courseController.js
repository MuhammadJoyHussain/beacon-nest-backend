const Course = require('../models/Course')

exports.getCoursesBySkills = async (req, res) => {
  try {
    const skillQuery = req.query.skills
    let courses

    if (skillQuery) {
      const skills = skillQuery
        .split(',')
        .map((skill) => skill.trim().toLowerCase())

      courses = await Course.find({
        skill: { $in: skills },
      })
    } else {
      // No skills provided, return all courses
      courses = await Course.find({})
    }

    res.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.createCoursesBySkills = async (req, res) => {
  try {
    const courses = req.body

    if (!Array.isArray(courses) || courses.length === 0) {
      return res
        .status(400)
        .json({ message: 'Please provide an array of courses.' })
    }

    const savedCourses = await Course.insertMany(courses)
    res.status(200).json(savedCourses)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createCourseBySkills = async (req, res) => {
  try {
    const { skill, courses } = req.body

    const newCourses = new Course({
      skill,
      courses,
    })

    const savedCourses = await newCourses.save()

    res.status(200).json(savedCourses)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
