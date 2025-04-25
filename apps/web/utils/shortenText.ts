export const shortenText = (text: string, maxLength: number): string => {
  if (!text) return text

  if (text.length <= maxLength) {
    return text
  }

  const shortenedText = text.slice(0, maxLength)

  if (text[maxLength] === ' ') {
    return endsWithDot(shortenedText) ? shortenedText : `${shortenedText} ...`
  }

  const spaceIndex = shortenedText.lastIndexOf(' ')
  if (spaceIndex < 0) {
    return endsWithDot(shortenedText) ? shortenedText : `${shortenedText} ...`
  }

  const finalText = text.slice(0, spaceIndex)
  return endsWithDot(finalText) ? finalText : `${finalText} ...`
}

const endsWithDot = (str: string) => /\.\.*$/.test(str.trim())
