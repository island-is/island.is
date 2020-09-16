import fetch from 'node-fetch'
import { environment } from '../environments/environment'
import { logger } from '@island.is/logging'
import _ from 'lodash'
import { AwsEsPackage } from './aws'

const analyzers = ['stemmer', 'keywords', 'synonyms', 'stopwords']

const getDictUrl = (type: string, lang: string): string => {
  const url = environment.dictRepo
    .replace('api.github', 'github')
    .replace('/repos/', '/')
  return `${url}/blob/master/${lang}/${type}.txt?raw=true`
}

const getFile = (url: string) => {
  logger.info('Getting file from', { url })
  return fetch(url)
}

type dictionaryVersion = { tag_name: string }
export const getDictionaryVersion = async (): Promise<string> => {
  const url = environment.dictRepo + '/releases/latest'
  const data: dictionaryVersion = await getFile(url).then((raw) => {
    return raw.json()
  })
  return data.tag_name
}

export interface Dictionary {
  analyzerType: string
  locale: string
  file: NodeJS.ReadableStream
}
export const getDictionaryFiles = async (): Promise<Dictionary[]> => {
  const locales = environment.locales

  const dictionaries = locales.map((locale) => {
    return analyzers.map(async (analyzerType) => {
      const fileUrl = getDictUrl(analyzerType, locale)
      const response = await getFile(fileUrl)
      // only add found dictionaries to list, this tackles no dictionary provided for lang problem
      if (response.status === 200) {
        return {
          analyzerType,
          locale,
          file: response.body,
        }
      } else {
        // we will filter this from the dictionaries later
        return false
      }
    })
  })

  const allDictionaryResponses = await Promise.all(_.flatten(dictionaries))
  return allDictionaryResponses.filter(
    (response): response is Dictionary => response !== false,
  )
}

export const getFakeEsPackages = (): AwsEsPackage[] => {
  const locales = environment.locales
  const fakePackages = locales.map((locale) => {
    return analyzers.map((analyzer) => ({
      packageId: `${analyzer}.txt`,
      analyzerType: analyzer,
      locale,
    }))
  })
  return _.flatten(fakePackages)
}
