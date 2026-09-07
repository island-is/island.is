const HTML_ESCAPE_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_ENTITIES[char])

const HTML_NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

// String.fromCodePoint throws RangeError outside the Unicode range, and lone
// surrogates would decode to broken output rather than a character.
const isValidCodePoint = (codePoint: number) =>
  Number.isInteger(codePoint) &&
  codePoint >= 0 &&
  codePoint <= 0x10ffff &&
  !(codePoint >= 0xd800 && codePoint <= 0xdfff)

export const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return isValidCodePoint(codePoint)
        ? String.fromCodePoint(codePoint)
        : match
    }
    return HTML_NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })

// The plain-text body of an HTML fragment: tags dropped, entities decoded.
export const htmlToPlainText = (value: string) =>
  decodeHtmlEntities(value.replace(/<[^>]*>/g, '')).trim()
