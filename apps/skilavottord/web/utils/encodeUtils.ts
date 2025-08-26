export const encode = (input: string): string => {
  // Normalize the string to decompose characters with diacritics
  const normalized = input.normalize('NFD')

  // Replace specific Icelandic characters not handled by diacritic removal
  let replaced = normalized.replace(/[ðÐ]/g, 'd')
  replaced = replaced.replace(/[þÞ]/g, 'th')
  replaced = replaced.replace(/[æÆ]/g, 'ae')

  // Remove diacritical marks
  const noDiacritics = replaced.replace(/(?:[\u0300-\u036f])/g, '')

  // Remove special characters
  const cleaned = noDiacritics.replace(/[^a-zA-Z0-9]/g, '')

  return cleaned.toLocaleLowerCase()
}
