const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const ServerlessHttp = require('serverless-http')

dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use(cors())
connectDB()

// Routes
app.use('/api/candidate', require('./routes/candidate'))
app.use('/api/vacancy', require('./routes/vacancy'))
app.use('/api/application', require('./routes/application'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api', require('./routes/pdf'))

module.exports.handler = ServerlessHttp(app)
