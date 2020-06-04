import { createClient, EntryCollection } from 'contentful'
import { environment } from '../environments'

const { accessToken, space } = environment.contentful

if (!space || !accessToken) {
  throw new Error('Missing Contentful environment variables')
}

const client = createClient({ space, accessToken })
const validLocales = ['is-IS', 'en-GB']
const localeMap = {
  is: 'is-IS',
  en: 'en-GB',
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
  query: any,
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
