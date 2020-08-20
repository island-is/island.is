import { createClient, EntryCollection } from 'contentful'

const space = '8k0h54kbe6bj'
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentfulQuery = any

if (!space || !accessToken) {
  throw new Error('Missing Contentful environment variables')
}

const client = createClient({
  space,
  accessToken,
  environment: 'master',
  host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
})

const validLocales = ['is-IS', 'en']
const localeMap = {
  is: 'is-IS',
  en: 'en',
}

type Result<T> = Promise<EntryCollection<T>>

export async function getLocales() {
  const locales = await client.getLocales()
  return locales.items.map(({ code, name }) => ({
    code,
    name,
  }))
}

export async function getLocalizedEntries<Fields>(
  languageCode: undefined | null | string,
  query: ContentfulQuery,
): Result<Fields> {
  let code = languageCode ?? 'is-IS'
  if (localeMap[code]) {
    code = localeMap[code]
  }

  return client.getEntries({
    locale: validLocales.includes(code) ? code : 'is-IS',
    include: 4,
    ...query,
  })
}
