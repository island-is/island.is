const icelandicAlphabetOrder = 'AÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖ'

export const sortByIcelandicAlphabet = (arr: string[]): string[] => {
  const maxLength = arr.reduce(
    (max, str) => Math.max(max, (str || '').length),
    0,
  )

  return arr.sort((a, b) => compareLocaleIS(a, b, maxLength))
}

export const compareLocaleIS = (
  a: string | undefined | null,
  b: string | undefined | null,
  maxLength?: number,
): number => {
  maxLength = maxLength || Math.max((a || '').length, (b || '').length)

  for (let i = 0; i < maxLength; i++) {
    const charA = (a || '')[i] || ''
    const charB = (b || '')[i] || ''
    const indexA = icelandicAlphabetOrder.indexOf(charA.toUpperCase())
    const indexB = icelandicAlphabetOrder.indexOf(charB.toUpperCase())

    if (indexA === -1 || indexB === -1) {
      // Fallback to localeCompare for characters not in the Icelandic alphabet
      return (a || '').localeCompare(b || '', 'is')
    }

    if (indexA < indexB) return -1
    if (indexA > indexB) return 1
  }
  return 0
}
