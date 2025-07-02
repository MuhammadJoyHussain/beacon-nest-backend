const Vacancy = require('../models/Vacancy')

exports.getVacancy = async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      department,
      company,
      search,
      page = 1,
      limit = 10,
    } = req.query

    const query = {}

    if (title) query.title = new RegExp(title, 'i')
    if (location) query.location = new RegExp(location, 'i')
    if (type) query.type = type
    if (department) query.department = new RegExp(department, 'i')
    if (company) query.company = new RegExp(company, 'i')

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { department: new RegExp(search, 'i') },
      ]
    }

    const vacancies = await Vacancy.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Vacancy.countDocuments(query)

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: vacancies,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.insertMany(req.body)
    res.status(201).json(vacancies)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.createVacancy = async (req, res) => {
  try {
    const vacancy = new Vacancy(req.body)
    await vacancy.save()
    res.status(201).json(vacancy)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getVacancyById = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id)
    if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' })
    res.json(vacancy)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteManyVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.deleteMany()
    if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' })
    res.json({ message: 'Vacancy deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findByIdAndDelete(req.params.id)
    if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' })
    res.json({ message: 'Vacancy deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
