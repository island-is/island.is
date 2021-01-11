import shorthash from 'shorthash'
import { template as isIndexTemplate } from './index-templates/template-is'
import { template as enIndexTemplate } from './index-templates/template-en'
import { environment } from '../environment'

export type ElasticsearchIndexLocale = 'is' | 'en'

const indexTemplateMap = {
  is: JSON.stringify(isIndexTemplate),
  en: JSON.stringify(enIndexTemplate)
}

export const getDictionaryVersion = () => environment.dictionaryVersion // TODO: Remove this in this version
export const getIndexTemplate = (locale: ElasticsearchIndexLocale) => indexTemplateMap[locale]

const configAsString = indexTemplateMap['is'] + indexTemplateMap['en'] + getDictionaryVersion()
const indexTemplateHash = shorthash.unique(configAsString).toLowerCase() // this must be lovercase allways!

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

/*
What should the hash contain?
index template content
dictionary version number sha? (env variable)

What needs to know dictionary version?
Migration script
current index

How should we determine dictionary version?
Get the dictionary files and generate a hash from their content on start,
then use the generated hash to get git tag from a database?
We only write dictionary files to database if we see a new hash?
How does a developer know which version has been updated, how do we handle inconsistencies between environments?

Make dictionaries upload into aws es with a name like is-stemmer-DICTIONARYHASH
Make index names be like island-is-INDEXHASH
Make migration log the current INDEX-, and DICTIONARYHASH to ease development
Update dictionary readme with
*/

// TODO: Make API use new index setup everywhere
// TODO: Make sure index updating is backwards compatible
// TODO: Change how migrate uploads and manages dictionary file names
// TODO: Make sure index generation fails if environment dictionary hash does not exist (when getting files in migration?)
