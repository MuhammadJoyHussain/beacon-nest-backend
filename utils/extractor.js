const {
  knownCompanies,
  companyIndicators,
  positionKeywords,
  streetKeywords,
  countries,
  ukCities,
  educationSectionKeywords,
  companyKeywords,
} = require('./constants')

const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '')

const extractFullName = (text) => {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
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

const isLikelyCompany = (line) => {
  if (!line || line.length > 100) return false
  const clean = line.trim()

  const hasIndicator = companyKeywords.some((kw) =>
    clean.toLowerCase().includes(kw.toLowerCase())
  )
  const isKnown = companyKeywords.some(
    (name) => clean.toLowerCase() === name.toLowerCase()
  )
  const isCapitalizedShort = /^[A-Z][a-zA-Z]*( [A-Z][a-zA-Z]*)?$/.test(clean)

  return hasIndicator || isKnown || isCapitalizedShort
}

function isLikelyPosition(line) {
  return (
    positionKeywords.some((kw) =>
      line.toLowerCase().includes(kw.toLowerCase())
    ) || /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(line)
  )
}

function extractExperience(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const dateRegex =
    /((?:\d{1,2}\/\d{4})|(?:[A-Za-z]{3,9} \d{4}))\s*[-–]\s*((?:present)|(?:\d{1,2}\/\d{4})|(?:[A-Za-z]{3,9} \d{4}))/i
  const locationRegex = /^(.+?),\s*([A-Za-z ]+)$/
  const experiences = []
  let current = null

  const isSectionHeader = (line) =>
    educationSectionKeywords.some((kw) =>
      line.toLowerCase().includes(kw.toLowerCase())
    )

  const isValidText = (line) =>
    line &&
    !isSectionHeader(line) &&
    !line.startsWith('•') &&
    !line.startsWith('-') &&
    /^[A-Z][\w\s&().-]+$/.test(line)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const dateMatch = line.match(dateRegex)

    if (dateMatch) {
      if (current) experiences.push(current)

      let position = ''
      let company = ''

      for (let j = i - 1; j >= i - 4 && j >= 0; j--) {
        const prevLine = lines[j]

        if (!position && isLikelyPosition(prevLine) && isValidText(prevLine)) {
          position = prevLine
          continue
        }

        if (!company && isLikelyCompany(prevLine) && isValidText(prevLine)) {
          company = prevLine
          continue
        }
      }

      current = {
        position: position || '',
        company: company || '',
        startDate: formatDate(dateMatch[1]),
        endDate: /present/i.test(dateMatch[2])
          ? 'Present'
          : formatDate(dateMatch[2]),
        city: '',
        country: '',
        description: [],
      }
      continue
    }

    if (current) {
      if (!current.city && !current.country) {
        const nextLine = lines[i + 1] || ''
        const currentLine = line.trim()
        const nextTrimmed = nextLine.trim()

        // Combined city, country on one line
        const combinedMatch = currentLine.match(/^(.+?),\s*([A-Za-z ]+)$/i)
        if (combinedMatch && countries.includes(combinedMatch[2].trim())) {
          current.city = combinedMatch[1].trim()
          current.country = combinedMatch[2].trim()
          continue
        }

        // Two-line location (e.g., "Milton Keynes," + "United Kingdom")
        if (currentLine.endsWith(',') && countries.includes(nextTrimmed)) {
          current.city = currentLine.replace(',', '').trim()
          current.country = nextTrimmed
          i++ // Skip the next line
          continue
        }
      }

      if (line.startsWith('•') || line.startsWith('-') || line.length > 20) {
        current.description.push(line.replace(/^•?\s*-?\s*/, '').trim())
      }
    }
  }

  if (current && current.position && current.company) {
    experiences.push(current)
  }

  return experiences.filter(
    (e) => e.position && e.company && e.startDate && e.endDate
  )
}

function extractEducation(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const educationEntries = []
  let current = null

  const dateRegex = /(\d{2}\/\d{4})\s*[-–]\s*(present|\d{2}\/\d{4})/i
  const locationRegex = /^(.+?),\s*([A-Za-z ]+)$/i
  const sectionStartRegex = new RegExp(
    `(${educationSectionKeywords.join('|')})`,
    'i'
  )

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (sectionStartRegex.test(line) && current) {
      educationEntries.push(current)
      current = null
      continue
    }

    const dateMatch = line.match(dateRegex)
    if (dateMatch) {
      if (current) educationEntries.push(current)

      current = {
        position: '',
        company: '',
        startDate: formatDate(dateMatch[1]),
        endDate: formatDate(dateMatch[2]),
        city: '',
        country: '',
        description: [],
      }
      continue
    }

    const locationMatch = line.match(locationRegex)
    if (current && locationMatch) {
      const city = locationMatch[1]
      const country = locationMatch[2]
      if (countries.includes(country)) {
        current.city = city
        current.country = country
      }
      continue
    }

    if (current) {
      if (!current.position) current.position = line
      else if (!current.company) current.company = line
      else current.description.push(line.replace(/^•\s*/, ''))
    }
  }

  if (current && current.position && current.company) {
    educationEntries.push(current)
  }

  return educationEntries
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
  extractEducation,
}
