import { unique } from 'shorthash'
import { Locale } from '@island.is/shared/types'

import { template as isIndexTemplate } from './index-templates/template-is'
import { template as enIndexTemplate } from './index-templates/template-en'
import { config } from './config'

export type ElasticsearchIndexLocale = Locale

const indexTemplateMap = {
  is: JSON.stringify(isIndexTemplate),
  en: JSON.stringify(enIndexTemplate),
}

export const getIndexTemplate = (locale: ElasticsearchIndexLocale) =>
  indexTemplateMap[locale]

export const getDictionaryVersion = () => config.dictionaryVersion

const configAsString =
  getIndexTemplate('is') + getIndexTemplate('en') + getDictionaryVersion()
const indexTemplateHash = unique(configAsString).toLowerCase()

export const getElasticVersion = (): string => {
  return indexTemplateHash
}

export const getElasticsearchIndexBase = (locale: ElasticsearchIndexLocale) =>
  `island-${locale}`

// returns current index by default for a given locale
export const getElasticsearchIndex = (
  locale: ElasticsearchIndexLocale,
  versionOverwrite?: string,
) => {
  const base = getElasticsearchIndexBase(locale)
  const version = getElasticVersion()
  return `${base}-${versionOverwrite ?? version}`
}
