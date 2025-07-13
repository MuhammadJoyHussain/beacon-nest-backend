const axios = require('axios')

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.PUBLIC_BASE_URL || 'https://your-vercel-app.vercel.app'

const axiosClient = axios.create({
  baseURL,
  timeout: 5000,
})

module.exports = axiosClient
