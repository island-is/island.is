const HTML_NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

export const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint)
    }
    return HTML_NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })

export const decodeEditorHtml = (base64: string) => {
  try {
    return atob(base64)
      .replace(/<[^>]*>/g, '')
      .trim()
  } catch {
    return ''
  }
}
