const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  shareCode: { type: String, required: true },

  // Contact Information
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },

  // Address
  street: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  country: { type: String, required: true },

  // Employment Details
  department: {
    type: String,
    enum: ['HR', 'IT', 'Sales', 'Marketing', 'Finance'],
    required: true,
  },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },

  // Account Setup
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed before saving

  // Consents
  terms: { type: Boolean, required: true },
  gdpr: { type: Boolean, required: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
