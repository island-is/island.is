export const convertToSlug = (text: string): string => {
  const icelandicToEnglishMap: { [key: string]: string } = {
    á: 'a',
    ð: 'd',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    ý: 'y',
    þ: 'th',
    æ: 'ae',
    ö: 'o',
    Á: 'A',
    Ð: 'D',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U',
    Ý: 'Y',
    Þ: 'Th',
    Æ: 'Ae',
    Ö: 'O',
  }

  return text
    .split('')
    .map((char) => icelandicToEnglishMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .toLowerCase()
}
