export const shortenText = (
  text: string | null | undefined,
  maxLength: number,
) => {
  if (!text) return text

  if (text.length <= maxLength) {
    return text
  }

  const shortenedText = text.slice(0, maxLength)

  if (text[maxLength] === ' ') {
    return `${shortenedText} ...`
  }

  // Search for the nearest space before the maxLength
  const spaceIndex = shortenedText.lastIndexOf(' ')

  if (spaceIndex < 0) {
    return `${shortenedText} ...`
  }

  return `${text.slice(0, spaceIndex)} ...`
}
