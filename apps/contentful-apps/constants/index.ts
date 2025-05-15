export const CONTENTFUL_ENVIRONMENT = 'master'
export const CONTENTFUL_SPACE = '8k0h54kbe6bj'
export const DEFAULT_LOCALE = 'is-IS'
export const DEV_WEB_BASE_URL = 'https://beta.dev01.devland.is'

export const TITLE_SEARCH_POSTFIX = '--title-search'
export const SLUGIFIED_POSTFIX = '--slugified'

export const CUSTOM_SLUGIFY_REPLACEMENTS: ReadonlyArray<[string, string]> = [
  ['ö', 'o'],
  ['Ö', 'o'],
  ['þ', 'th'],
  ['Þ', 'th'],
]
