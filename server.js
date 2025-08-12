const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()
const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
connectDB()

// Routes
app.use('/api/vacancy', require('./routes/vacancyRoute'))
app.use('/api/application', require('./routes/applicationRoute'))
app.use('/api/course', require('./routes/courseRoute'))
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/admin', require('./routes/adminRoute'))
app.use('/api/recommend', require('./routes/recommendRoutes'))
app.use('/api', require('./routes/pdfRoute'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
