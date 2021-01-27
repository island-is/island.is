import { logger } from '@island.is/logging'
import { ElasticService } from '@island.is/content-search-toolkit'
import { AwsEsPackage } from './aws'
import { SyncOptions } from '@island.is/content-search-indexer/types'
import {
  ElasticsearchIndexLocale,
  getIndexTemplate,
} from '@island.is/content-search-index-manager'
import {
  IndexingModule,
  IndexingService,
} from '@island.is/content-search-indexer'
import { NestFactory } from '@nestjs/core'
import {
  MetricsModule,
  MetricsService,
} from '@island.is/content-search-metrics'

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
  logger.info('Updating template', { templateName })
  const client = await esService.getClient()
  return client.indices.putTemplate({
    name: templateName,
    body: templateBody,
  })
}

export const updateIndexTemplate = (
  locale: ElasticsearchIndexLocale,
  esPackages: AwsEsPackage[],
) => {
  const packageMap = parseEsPackages(esPackages)
  const templateBody = createTemplateBody(locale, packageMap)
  return updateEsTemplate(locale, templateBody)
}

export const importContentToIndex = async (
  locale: ElasticsearchIndexLocale,
  index: string,
  syncType: SyncOptions['syncType'],
) => {
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
