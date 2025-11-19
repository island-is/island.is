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
