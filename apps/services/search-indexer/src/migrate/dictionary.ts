import fetch from 'node-fetch'
import { environment } from '../environments/environment'
import { logger } from '@island.is/logging'
import _ from 'lodash'

const getDictUrl = (type: string, lang: string): string => {
  const url = environment.migrate.dictRepo
    .replace('api.github', 'github')
    .replace('/repos/', '/')
  return `${url}/blob/master/${lang}/${type}.txt?raw=true`
}

const getFile = (url: string) => {
  logger.info('getting file from', { url })
  return fetch(url)
}

const promiseAll = async (object) => {
  return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}

type dictionaryVersion = { tag_name: string }
export const getDictionaryVersion = async (): Promise<string> => {
  const url = environment.migrate.dictRepo + '/releases/latest'
  const data: dictionaryVersion = await getFile(url).then((raw) => {
    return raw.json()
  })
  return data.tag_name
}

export const getDictionaryFiles = async () => {
  const locales = ['is', 'en']
  const analyzers = ['stemmer', 'keywords', 'synonyms', 'stopwords']
  const dictionaries = {}
  for (const locale of locales) {
    dictionaries[locale] = await promiseAll(analyzers.reduce((dictionaryFiles, analyzerType) => {
      const fileUrl = getDictUrl(analyzerType, locale)
      dictionaryFiles[analyzerType] = getFile(fileUrl).then(response => response.body)
      return dictionaryFiles
    }, {}))
  }
  return dictionaries
}
