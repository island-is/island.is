import type { TagVariant } from '@island.is/island-ui/core'

export const getExcerpt = (text: string, maxLength = 240): string => {
  if (!text || text.length <= maxLength) {
    return text
  }

  // Find all sentence-ending punctuation within or near maxLength
  const sentenceEndRegex = /[.!?]/g
  let match
  let lastPunctuationIndex = -1

  while ((match = sentenceEndRegex.exec(text)) !== null) {
    if (match.index <= maxLength) {
      lastPunctuationIndex = match.index
    } else {
      break
    }
  }

  // If we found sentence-ending punctuation within the limit, use it
  if (lastPunctuationIndex !== -1) {
    return text.substring(0, lastPunctuationIndex + 1).trim()
  }

  // No punctuation found within limit - truncate at last complete word and add "..."
  const truncated = text.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex === -1) {
    return truncated.trim() + '...'
  }

  return truncated.substring(0, lastSpaceIndex).trim() + '...'
}

export const getDeadlineVariant = (deadline: string): TagVariant => {
  // Parse European format (DD.MM.YYYY)
  const parts = deadline.split('.')
  if (parts.length !== 3) {
    return 'mint' // Unexpected format
  }

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  // Validate date components before creating Date object
  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  ) {
    return 'mint' // Invalid date values
  }

  const deadlineDate = new Date(year, month - 1, day) // months are 0-indexed

  // Validate the created date matches input (catches rollover like Feb 31 → Mar 2)
  if (
    isNaN(deadlineDate.getTime()) ||
    deadlineDate.getDate() !== day ||
    deadlineDate.getMonth() !== month - 1 ||
    deadlineDate.getFullYear() !== year
  ) {
    return 'mint'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return deadlineDate < today ? 'red' : 'mint'
}
