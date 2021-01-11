import shorthash from 'shorthash'
import { template as isIndexTemplate } from './index-templates/template-is'
import { template as enIndexTemplate } from './index-templates/template-en'

export type ElasticsearchIndexLocale = 'is' | 'en'

const indexTemplateMap = {
  is: JSON.stringify(isIndexTemplate),
  en: JSON.stringify(enIndexTemplate),
}

export const getIndexTemplate = (locale: ElasticsearchIndexLocale) =>
  indexTemplateMap[locale]

const configAsString = indexTemplateMap['is'] + indexTemplateMap['en']
const indexTemplateHash = shorthash.unique(configAsString).toLowerCase()

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
