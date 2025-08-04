const Candidate = require('../models/Candidate')

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
    res.json(candidates)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
    if (!candidate)
      return res.status(404).json({ message: 'Candidate not found' })
    res.json(candidate)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createCandidates = async (req, res) => {
  try {
    const candidates = req.body

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res
        .status(400)
        .json({ message: 'Please provide an array of candidates.' })
    }

    const savedCandidates = await Candidate.insertMany(candidates)
    res.status(201).json(savedCandidates)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const createCandidate = async (req, res) => {
  try {
    const { name, role, rating, reviews, description, skills, location, rate } =
      req.body

    const newCandidate = new Candidate({
      name,
      role,
      rating,
      reviews,
      description,
      skills,
      location,
      rate,
    })

    const savedCandidate = await newCandidate.save()
    res.status(201).json(savedCandidate)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateCandidate = async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedCandidate)
      return res.status(404).json({ message: 'Candidate not found' })

    res.json(updatedCandidate)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteCandidate = async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id)

    if (!deletedCandidate)
      return res.status(404).json({ message: 'Candidate not found' })

    res.json({ message: 'Candidate deleted', candidate: deletedCandidate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getCandidates,
  getCandidate,
  createCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
}
