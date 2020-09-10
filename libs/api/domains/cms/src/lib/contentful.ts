import { createClient, EntryCollection } from 'contentful'
import once from 'lodash/once'

const space = '8k0h54kbe6bj'
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentfulQuery = any

const validLocales = ['is', 'en']
const localeMap = {
  is: 'is',
  en: 'en',
}

const getClientInstance = once(() => {
  if (!accessToken) {
    throw new Error(
      'Missing Contentful environment variables: CONTENTFUL_ACCESS_TOKEN',
    )
  }

  return createClient({
    space,
    accessToken,
    environment: 'master',
    host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
  })
})

type Result<T> = Promise<EntryCollection<T>>

export async function getLocales() {
  const locales = await getClientInstance().getLocales()
  return locales.items.map(({ code, name }) => ({
    code,
    name,
  }))
}

export async function getLocalizedEntries<Fields>(
  languageCode: undefined | null | string,
  query: ContentfulQuery,
): Result<Fields> {
  let code = languageCode ?? 'is'
  if (localeMap[code]) {
    code = localeMap[code]
  }

  return getClientInstance().getEntries({
    locale: validLocales.includes(code) ? code : 'is',
    include: 4,
    ...query,
  })
}
