import { createClient, EntryCollection } from 'contentful'
import once from 'lodash/once'

const space = '8k0h54kbe6bj'
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentfulQuery = any

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
  languageCode = 'is',
  query: ContentfulQuery,
): Result<Fields> {
  return getClientInstance().getEntries({
    locale: languageCode,
    include: 4,
    ...query,
  })
}
