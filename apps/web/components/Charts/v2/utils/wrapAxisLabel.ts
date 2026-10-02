import { hyphenateText } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'

const SOFT_HYPHEN = '­'

// Last resort for a syllable that is still too long, e.g. a foreign word
// hyphenateText has no pattern for
const splitToLength = (text: string, length: number): string[] => {
  if (length < 1 || text.length <= length) {
    return [text]
  }
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += length) {
    chunks.push(text.slice(i, i + length))
  }
  return chunks
}

// Wraps an axis label into lines, breaking long words at syllable boundaries
export const wrapAxisLabel = (
  label: string,
  maxCharsPerLine: number,
  maxLines: number,
  locale: Locale = 'is',
): string[] => {
  if (!label) {
    return []
  }

  const hyphenated = hyphenateText(label, { locale }).trim()
  const words = hyphenated.split(' ').filter(Boolean)

  const lines: string[] = []
  let currentLine = ''

  const pushCurrentLine = () => {
    if (currentLine) {
      lines.push(currentLine)
      currentLine = ''
    }
  }

  for (const word of words) {
    const plainWord = word.replace(new RegExp(SOFT_HYPHEN, 'g'), '')
    const candidate = currentLine ? `${currentLine} ${plainWord}` : plainWord

    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate
      continue
    }

    if (plainWord.length <= maxCharsPerLine) {
      // Word fits on its own line, just not after the current one
      pushCurrentLine()
      currentLine = plainWord
      continue
    }

    // The word itself is too long for one line - break it at syllable
    // boundaries (soft hyphens) instead of mid-syllable
    pushCurrentLine()
    const syllables = word
      .split(SOFT_HYPHEN)
      .flatMap((syllable) => splitToLength(syllable, maxCharsPerLine - 1))
    let piece = ''
    for (const syllable of syllables) {
      const withSyllable = piece + syllable
      // Leave room for the hyphen added when the piece is pushed
      if (withSyllable.length > maxCharsPerLine - 1 && piece) {
        lines.push(`${piece}-`)
        piece = syllable
      } else {
        piece = withSyllable
      }
    }
    currentLine = piece
  }

  pushCurrentLine()

  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines)
    const lastLine = truncated[maxLines - 1]
      .slice(0, maxCharsPerLine - 1)
      .replace(/[\s-]+$/, '')
    truncated[maxLines - 1] = `${lastLine}…`
    return truncated
  }

  return lines
}
