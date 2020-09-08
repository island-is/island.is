import fs from 'fs'
import { logger } from '@island.is/logging'
import { ElasticService } from '@island.is/api/content-search'
import { AwsEsPackage } from './aws'

const esService = new ElasticService()

const getIndexBaseName = (locale: string) => {
  return `island-${locale}`
}

const getIndexNameForVersion = (locale: string, version: number) => {
  const indexPrefix = getIndexBaseName(locale)
  return `${indexPrefix}-v${version}`
}

export const checkAccess = () => {
  logger.info('Testing elasticsearch connection')
  return esService.ping().catch((error) => {
    logger.error('could not connect to elasticsearch server', { error })
    throw error
  })
}

// elasticsearch does not provide all return variants in its documentation, we only type a sensible subset of the return object
interface EsIndex {
  health: 'green' | 'yellow' | 'red'
  index: string
  status: string
  ['docs.count']: string
  ['docs.deleted']: string
}
const getAllIndice = async () => {
  const client = await esService.getClient()
  const indice = await client.cat.indices<EsIndex[]>({ format: 'json' })
  return indice.body
}

export const getVersionFromIndices = async (locale: string): Promise<number> => {
  logger.info('Getting index version from elasticsearch', { locale })
  const indice = await getAllIndice()
  const indicePrefix = getIndexBaseName(locale)

  // find the highest version matching our index prefix using our custom index naming convention
  return indice.reduce((higherstVersion, { index }) => {
    if (index.includes(indicePrefix)) {
      const versionPrefixLocation = index.lastIndexOf('-v') + 2
      const version = parseInt(index.substring(versionPrefixLocation, index.length))
      if (version > higherstVersion) {
        return version
      }
    }
    return higherstVersion
  }, 0)
}

const getTemplateName = (locale: string) => `template-${locale}`

const getTemplateFilePath = (locale: string) => {
  const templateName = getTemplateName(locale)
  return `./config/${templateName}.json`
}

export const getVersionFromConfig = (locale: string): number => {
  logger.info('Getting index version from config', { locale })
  const templateFilePath = getTemplateFilePath(locale)
  const raw = fs.readFileSync(templateFilePath)
  const json = JSON.parse(raw.toString())
  return json.version
}

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

// TODO: Make this handle empty locales as in locales with no aditional analyzers
// we inject aws es packages for analyzers here if needed
const createTemplateBody = (locale: string, packageMap: PackageMap): string => {
  logger.info('Creating template body', { locale })
  const templateFilePath = getTemplateFilePath(locale)
  let config = fs.readFileSync(templateFilePath).toString()

  // replace placeholders in config e.g. {STEMMER}
  const keys = Object.keys(packageMap[locale])
  for (const key of keys) {
    const packageId = packageMap[locale][key]
    config = config.replace(`{${key}}`, packageId)
  }

  logger.info('Created template config', { locale })
  return config
}

const updateEsTemplate = async (locale: string, templateBody: string) => {
  const templateName = getTemplateName(locale)
  logger.info('Updating template', { templateName })
  const client = await esService.getClient()
  return client.indices
    .putTemplate({
      name: templateName,
      body: templateBody,
    })
}

export const updateIndexTemplate = (locale: string, esPackages: AwsEsPackage[]) => {
  const packageMap = parseEsPackages(esPackages)
  const templateBody = createTemplateBody(locale, packageMap)
  return updateEsTemplate(locale, templateBody)
}

export const createNewIndexVersion = async (locale: string, version: number) => {
  const newIndexName = getIndexNameForVersion(locale, version)
  logger.info('Creating new index', { newIndexName })
  const client = await esService.getClient()
  await client.indices.create({
    index: newIndexName
  })
  return newIndexName
}

export const moveOldContentToNewIndex = async (locale: string, oldIndexVersion: number, newIndexVersion: number) => {
  // if we found no older index there is nothing to move
  if (oldIndexVersion === 0) {
    return false
  }
  const oldIndexName = getIndexNameForVersion(locale, oldIndexVersion)
  const newIndexName = getIndexNameForVersion(locale, newIndexVersion)

  logger.info('Moving content from old index to new index', { oldIndexName, newIndexName })

  const params = {
    waitForCompletion: true,
    body: {
      source: {
        index: oldIndexName,
      },
      dest: {
        index: newIndexName,
      },
    }
  }
  const client = await esService.getClient()
  await client.reindex(params)
  logger.info('Moved all content to new index')
  return true
}

export const moveAliasToNewIndex = async (locale: string, oldIndexVersion: number, newIndexVersion: number) => {
  logger.info('Moving alias to new version')
  const aliasName = getIndexBaseName(locale)
  const oldIndexName = getIndexNameForVersion(locale, oldIndexVersion)
  const newIndexName = getIndexNameForVersion(locale, newIndexVersion)

  // this is the recomented way to rename an alias, this operation is atomic when executed in a single api request
  const actions = []
  if (oldIndexVersion > 0) {
    actions.push({
      remove: {
        index: oldIndexName,
        alias: aliasName,
      },
    })
  }

  actions.push({
    add: {
      index: newIndexName,
      alias: aliasName,
    },
  })

  const params = {
    body: {
      actions: actions,
    },
  }

  const client = await esService.getClient()
  await client.indices.updateAliases(params)
  logger.info('Moved alias to new index', { newIndexName, oldIndexName })
}
