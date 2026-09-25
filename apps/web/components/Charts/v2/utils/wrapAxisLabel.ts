import { hyphenateText } from '@island.is/island-ui/core'

const SOFT_HYPHEN = '­'

/**
 * Wraps a chart axis label into multiple lines instead of Recharts either
 * overflowing it or (with interval="preserveEnd") dropping every other tick
 * to avoid the overflow. Uses Icelandic hyphenation so a single long word
 * (or a word that doesn't fit after the greedy word-wrap) breaks at a
 * linguistically correct syllable boundary rather than an arbitrary point.
 */
export const wrapAxisLabel = (
  label: string,
  maxCharsPerLine: number,
  maxLines: number,
): string[] => {
  if (!label) {
    return []
  }

  const hyphenated = hyphenateText(label, { locale: 'is' }).trim()
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
    const syllables = word.split(SOFT_HYPHEN)
    let piece = ''
    for (const syllable of syllables) {
      const withSyllable = piece + syllable
      if (withSyllable.length > maxCharsPerLine && piece) {
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
    truncated[maxLines - 1] = `${truncated[maxLines - 1]}…`
    return truncated
  }

  return lines
}
