import { createClient, EntryCollection } from 'contentful'
import { environment } from './environments'

const { cacheTime } = environment

import once from 'lodash/once'

const space = '8k0h54kbe6bj'
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentfulQuery = any

const validLocales = ['is-IS', 'en']
const localeMap = {
  is: 'is-IS',
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

const results = []

export async function getLocalizedEntries<Fields>(
  languageCode: undefined | null | string,
  query: ContentfulQuery,
) {
  let code = languageCode ?? 'is-IS'

  if (localeMap[code]) {
    code = localeMap[code]
  }

  const queryString = JSON.stringify(query) + code

  const existingResult = results.find((x) => x.queryString === queryString)

  const getResult = async (): Result<Fields> => {
    return getClientInstance().getEntries({
      locale: validLocales.includes(code) ? code : 'is-IS',
      include: 4,
      ...query,
    })
  }

  const getSeconds = () => new Date().getTime() / 1000

  if (!existingResult) {
    const data = await getResult()

    results.push({
      queryString,
      time: getSeconds(),
      data,
    })

    return data
  }

  if (existingResult.time + cacheTime < getSeconds()) {
    const existingIndex = results.findIndex(
      (x) => x.queryString === queryString,
    )
    const data = await getResult()

    results.splice(existingIndex, 1, {
      queryString,
      time: getSeconds(),
      data,
    })

    return data
  }

  return existingResult.data
}
