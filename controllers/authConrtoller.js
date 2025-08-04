const axios = require('axios')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
}

exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    gender,
    email,
    phone,
    street,
    city,
    postcode,
    country,
    department,
    position,
    startDate,
    username,
    password,
    confirmPassword,
    shareCode,
    terms,
    gdpr,
    role,
  } = req.body

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with email or username already exists' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    const user = await User.create({
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      street,
      city,
      postcode,
      country,
      department,
      position,
      startDate,
      username,
      password,
      shareCode,
      terms,
      gdpr,
      role: role || 'user',
    })

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error. Try again later.' })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const allowedUpdates = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'street',
      'city',
      'postcode',
      'country',
    ]
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field]
      }
    })

    const updatedUser = await user.save()

    const { password, ...userData } = updatedUser.toObject()
    res.json(userData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateUserByAdmin = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id
    const adminUserId = req.user._id.toString()

    const userToUpdate = await User.findById(userIdToUpdate)
    if (!userToUpdate)
      return res.status(404).json({ message: 'User not found' })

    if (userToUpdate.role === 'admin' && userIdToUpdate !== adminUserId) {
      return res
        .status(403)
        .json({ message: "Admins can't update other admin users" })
    }

    const allowedUpdates = [
      'firstName',
      'lastName',
      'email',
      'role',
      'phone',
      'street',
      'city',
      'postcode',
      'country',
    ]
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        userToUpdate[field] = req.body[field]
      }
    })

    const updatedUser = await userToUpdate.save()

    const { password, ...userData } = updatedUser.toObject()
    res.json(userData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const userIdToDelete = req.params.id
    const adminUserId = req.user._id.toString()

    const userToDelete = await User.findById(userIdToDelete)
    if (!userToDelete)
      return res.status(404).json({ message: 'User not found' })

    if (userToDelete.role === 'admin' && userIdToDelete !== adminUserId) {
      return res
        .status(403)
        .json({ message: "Admins can't delete other admin users" })
    }

    await userToDelete.deleteOne()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
