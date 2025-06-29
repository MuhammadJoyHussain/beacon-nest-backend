// utils/extractors.js
const ukCities = [
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Glasgow',
  'Sheffield',
  'Bradford',
  'Liverpool',
  'Edinburgh',
  'Bristol',
  'Cardiff',
  'Coventry',
  'Leicester',
  'Nottingham',
  'Newcastle',
  'Hull',
  'Stoke',
  'Wolverhampton',
  'Southampton',
  'Plymouth',
  'Derby',
  'Portsmouth',
  'Luton',
  'Sunderland',
  'Brighton',
  'Southend-on-Sea',
]

const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '')

const dateLineRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*[-–]\s*(present|\d{4})/i

const locationRegex = /([A-Za-z\s]+),\s*([A-Za-z\s]+)/

const bulletPointRegex = /^[•\-–]/

const extractFullName = (text) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const topLines = lines.slice(0, 10)
  const excluded = ['cv', 'resume', 'contact', 'email', 'phone']

  const isLikelyName = (line) =>
    /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/.test(line) &&
    !excluded.some((word) => line.toLowerCase().includes(word)) &&
    line.length < 40 &&
    line.split(' ').length <= 4

  return topLines.find(isLikelyName) || lines.find(isLikelyName) || ''
}

const extractEmail = (text) => {
  const match = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  )
  return match ? match[0] : ''
}

const extractPhone = (text) => {
  const match = text.match(/(\+44\s?7\d{3}|\b0\d{3,4})\s?\d{3,4}\s?\d{3,4}/)
  return match ? match[0].replace(/\s+/g, ' ').trim() : ''
}

const extractStreetAndCity = (text) => {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const streetKeywords = [
    'street',
    'road',
    'lane',
    'avenue',
    'drive',
    'boulevard',
    'close',
    'crescent',
  ]
  let streetCandidates = []
  let cityCandidates = []

  for (const line of lines) {
    const normLine = normalizeText(line)

    if (streetKeywords.some((keyword) => normLine.includes(keyword))) {
      streetCandidates.push(line)
    }

    for (const city of ukCities) {
      if (normLine.includes(normalizeText(city))) {
        cityCandidates.push(city)
      }
    }
  }

  const street = streetCandidates.length > 0 ? streetCandidates[0] : ''
  const city = cityCandidates.length > 0 ? cityCandidates[0] : ''

  return { street, city }
}

function extractExperience(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const experiences = []
  let current = {
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    city: '',
    country: '',
    description: [],
  }

  const dateRegex = /(\d{2}\/\d{4})\s*[-–]\s*(present|\d{2}\/\d{4})/i
  const locationRegex = /^(.+?),\s*(United Kingdom|UK|Bangladesh|India|USA)$/i

  let stage = 0 // 0 = position, 1 = company, 2 = dates, 3 = location, 4 = description

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for date
    const dateMatch = line.match(dateRegex)
    if (dateMatch) {
      current.startDate = formatDate(dateMatch[1])
      current.endDate = formatDate(dateMatch[2])
      stage = 3
      continue
    }

    // Check for location
    const locMatch = line.match(locationRegex)
    if (locMatch) {
      current.city = locMatch[1].trim()
      current.country = locMatch[2].trim()
      stage = 4
      continue
    }

    // Description lines (• or regular)
    if (stage === 4 && (line.startsWith('•') || /^[A-Z]/.test(line))) {
      current.description.push(line.replace(/^•\s*/, ''))
      continue
    }

    // Move to next entry when a new job title starts after previous is done
    if (
      stage === 4 &&
      /^[A-Z]/.test(line) &&
      !line.includes('•') &&
      !dateRegex.test(line) &&
      !locationRegex.test(line)
    ) {
      // Finalize previous
      if (current.position && current.company && current.startDate) {
        experiences.push({ ...current })
      }
      // Reset
      current = {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        city: '',
        country: '',
        description: [],
      }
      stage = 0
    }

    // Assign fields by stage
    if (stage === 0) {
      current.position = current.position ? `${current.position} ${line}` : line
    } else if (stage === 1) {
      current.company = current.company ? `${current.company} ${line}` : line
    } else if (stage < 3) {
      // Build company name (e.g., Garden Travels)
      current.company = current.company ? `${current.company} ${line}` : line
      stage = 1
    }
  }

  // Push final if valid
  if (current.position && current.company && current.startDate) {
    experiences.push(current)
  }

  return experiences
}

function formatDate(raw) {
  if (!raw) return ''
  const [month, year] = raw.split('/')
  return `${year}-${month}`
}

module.exports = {
  extractFullName,
  extractEmail,
  extractPhone,
  extractStreetAndCity,
  extractExperience,
}
