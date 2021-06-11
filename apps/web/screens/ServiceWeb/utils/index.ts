import slugify from '@sindresorhus/slugify'

export const asSlug = (s: string) =>
  slugify(s, {
    customReplacements: [
      ['ö', 'o'],
      ['Ö', 'o'],
      ['þ', 'th'],
      ['Þ', 'th'],
      ['ð', 'd'],
      ['Ð', 'd'],
      ['æ', 'ae'],
      ['Æ', 'ae'],
    ],
  })
