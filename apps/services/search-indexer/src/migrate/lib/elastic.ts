import { NestFactory } from '@nestjs/core'
import { logger } from '@island.is/logging'
import { ElasticService } from '@island.is/content-search-toolkit'
import {
  MappedData,
  SyncOptions,
} from '@island.is/content-search-indexer/types'
import {
  ElasticsearchIndexLocale,
  getIndexTemplate,
} from '@island.is/content-search-index-manager'
import {
  IndexingModule,
  IndexingService,
} from '@island.is/content-search-indexer'
import {
  MetricsModule,
  MetricsService,
} from '@island.is/content-search-metrics'
import { AwsEsPackage } from './aws'
import { SearchResponse } from '@island.is/shared/types'

const esService = new ElasticService()

export const checkAccess = () => {
  logger.info('Testing elasticsearch connection')
  return esService.ping().catch((error) => {
    logger.error('could not connect to elasticsearch server', { error })
    throw error
  })
}

export const checkIfIndexExists = async (index: string): Promise<boolean> => {
  logger.info('Checking if index exits', { index })
  const client = await esService.getClient()
  const result = await client.indices.exists({ index })
  return result.statusCode === 200
}

const getTemplateName = (locale: ElasticsearchIndexLocale) =>
  `template-${locale}`

interface PackageMap {
  [key: string]: {
    [key: string]: string
  }
}
const parseEsPackages = (esPackages: AwsEsPackage[]): PackageMap => {
  return esPackages.reduce((packageMap, esPackage) => {
    const { locale, analyzerType, packageId } = esPackage
    packageMap[locale] = { ...packageMap[locale], [analyzerType]: packageId }
    return packageMap
  }, {})
}

// we inject aws es packages for analyzers here if needed
const createTemplateBody = (
  locale: ElasticsearchIndexLocale,
  packageMap: PackageMap,
): string => {
  logger.info('Creating template body', { locale })
  let config = getIndexTemplate(locale)

  // locale might have no additional analyzers
  if (packageMap[locale]) {
    // replace placeholders in config e.g. {STEMMER}
    const keys = Object.keys(packageMap[locale])
    for (const key of keys) {
      const packageId = packageMap[locale][key]
      config = config.replace(`{${key.toUpperCase()}}`, packageId)
    }
  }

  logger.info('Created template config', { locale: locale })
  return config
}

export const getEsTemplate = async (locale: ElasticsearchIndexLocale) => {
  const templateName = getTemplateName(locale)
  logger.info('Geting old template', { templateName })
  const client = await esService.getClient()
  return client.indices
    .getTemplate<string>({
      name: templateName,
    })
    .then((response) => response.body[templateName])
    .catch((error) => {
      // template can not exist on initial run, handle it else throw
      if (error.statusCode === 404) {
        return ''
      } else {
        throw error
      }
    })
}

export const updateEsTemplate = async (
  locale: ElasticsearchIndexLocale,
  templateBody: string,
) => {
  const templateName = getTemplateName(locale)
  logger.info('Updating template', { templateName, templateBody })
  const client = await esService.getClient()
  return client.indices.putTemplate({
    name: templateName,
    body: templateBody,
    error_trace: true,
  })
}

export const updateIndexTemplate = async (
  locale: ElasticsearchIndexLocale,
  esPackages: AwsEsPackage[],
) => {
  const packageMap = parseEsPackages(esPackages)
  const templateBody = createTemplateBody(locale, packageMap)
  const response = await updateEsTemplate(locale, templateBody)
  logger.info('Successfully updated index template', { locale })
  return response
}

export const importContentToIndex = async (
  locale: ElasticsearchIndexLocale,
  index: string,
  syncType: SyncOptions['syncType'],
) => {
  logger.info(
    'Migration is starting content importer to move data into index',
    { index, syncType },
  )
  // we do a full sync here to import data
  const app = await NestFactory.create(IndexingModule)
  const indexingService = app.get(IndexingService)
  await indexingService.doSync({
    syncType,
    locale: locale as SyncOptions['locale'],
    elasticIndex: index,
  })
  await app.close()

  logger.info('Done with content import', { index, syncType })
  return true
}

export const rankSearchQueries = async (index: string) => {
  logger.info('Gathering content search query quality metrics', {
    index,
  })
  const app = await NestFactory.create(MetricsModule)
  const metricsService = app.get(MetricsService)
  const metrics = await metricsService.getCMSRankEvaluation({
    index,
    display: 'minimal',
  })
  logger.info('Content search query quality metrics', metrics)
}

export const removeIndexIfExists = async (indexName: string) => {
  const indexExists = await checkIfIndexExists(indexName)

  if (indexExists) {
    const client = await esService.getClient()
    await client.indices.delete({
      index: indexName,
    })
    return indexName
  }

  return false
}

/**
 * Returns all document ids and popularity scores from a given index
 *
 * @param {string} oldIndex
 */
export const getAllPopularityScores = async (index: string) => {
  const client = await esService.getClient()
  const scores = []

  // do a scroll query to get a snapshot of the index
  let data = await client.search<SearchResponse<MappedData>, unknown>({
    index,
    body: {
      query: {
        range: {
          popularityScore: {
            gt: 0,
          },
        },
      },
      size: 100,
      sort: [{ _id: { order: 'asc' } }],
      _source: ['popularityScore'],
    },
    scroll: '1m',
  })

  while (data.body.hits?.hits.length) {
    data.body.hits?.hits.forEach((x) => {
      scores.push({
        id: x._id,
        score: x._source.popularityScore,
      })
    })

    data = await client.scroll<SearchResponse<MappedData>, unknown>({
      scroll: '1m',
      scroll_id: data.body._scroll_id,
    })
  }
  return scores
}

/**
 * Read all documents from the old index and write their popularity scores to
 * the documents with corresponding ids in the new index
 *
 * @param {string} oldIndex
 * @param {string} newIndex
 */
export const migratePopularityScores = async (
  oldIndex: string,
  newIndex: string,
) => {
  const oldScores = await getAllPopularityScores(oldIndex)

  const requests = []

  oldScores.forEach((x) => {
    requests.push({
      update: { _index: newIndex, _id: x.id },
    })
    requests.push({
      doc: { popularityScore: x.score },
    })
  })

  await esService.bulkRequest(newIndex, requests)
}

/**
 * Returns the name of the second most recent island-* index with the given locale,
 * determined by creation date.
 *
 * @param {string} locale
 * @return {string}
 */
export const getPreviousIndex = async (locale: string): Promise<string> => {
  const client = await esService.getClient()

  const indices = await client.cat.indices({
    h: ['i', 'creation.date.string'],
    s: 'creation.date:desc',
  })

  const results = indices.body.match(
    new RegExp(`island-${locale}-[a-z0-9]+`, 'gi'),
  )

  // we don't want to return the current index
  if (results.length < 2) {
    return null
  }
  return results[1]
}
