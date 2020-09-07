import fs from 'fs'
import { environment } from '../environments/environment'
import { logger } from '@island.is/logging'
import { ElasticService } from '@island.is/api/content-search'

const esService = new ElasticService()

export const getCodeVersion = () => {
  const raw = fs.readFileSync(environment.migrate.codeTemplateFile)
  const json = JSON.parse(raw.toString())
  return json.version
}

export const checkAccess = () => {
  logger.info('Testing elasticsearch connection')
  return esService.ping().catch((error) => {
    logger.error('could not connect to elasticsearch server', { error })
    throw error
  })
}

export const getIndexNameForVersion = (version: number) => {
  return `island-is-v${version}`
}

export const esHasVersion = async (version: number) => {
  const indexName = getIndexNameForVersion(version)
  const client = await esService.getClient()
  const result = await client.indices.exists({
    index: indexName,
  })
  logger.info('Checking if index exists', {
    index: indexName,
    result: result.body,
  })
  return result.body
}

export const getMainAlias = async (): Promise<string | null> => {
  logger.info('Getting main alias')
  const client = await esService.getClient()
  return client.indices
    .getAlias({ name: environment.migrate.indexMain })
    .then((response) => {
      const body = response.body
      for (const index in body) {
        const aliases = body[index]['aliases']
        if (aliases[environment.migrate.indexMain] ?? null) {
          return index
        }
      }
      return null
    })
}

export const reindexToNewIndex = async (codeVersion: number) => {
  logger.info('Reindexing to new index code version is', { codeVersion })
  const oldIndex = await esGetOlderVersionIndex(codeVersion)
  if (!oldIndex) {
    logger.info('No older version found creating new index for this version')
    return createIndex(codeVersion)
  }

  const newIndex = getIndexNameForVersion(codeVersion)
  const params = {
    waitForCompletion: true,
    body: {
      source: {
        index: oldIndex,
      },
      dest: {
        index: newIndex,
      },
    },
  }
  logger.info('Reindex to new index', params)
  const client = await esService.getClient()
  const response = await client.reindex(params)
  logger.info('Reindex returned', response)
  return switchAlias(oldIndex, newIndex)
}

export const switchAlias = async (oldIndex: string | null, newIndex: string) => {
  const actions = []
  if (oldIndex) {
    actions.push({
      remove: {
        index: oldIndex,
        alias: environment.migrate.indexMain,
      },
    })
  }
  actions.push({
    add: {
      index: newIndex,
      alias: environment.migrate.indexMain,
    },
  })
  const params = {
    body: {
      actions: actions,
    },
  }
  logger.info('Switch Alias', params)

  const client = await esService.getClient()
  return client.indices.updateAliases(params)
}

const createIndex = async (codeVersion) => {
  const name = getIndexNameForVersion(codeVersion)
  const params = {
    index: name,
  }
  logger.info('Create Index', params)
  const client = await esService.getClient()
  return client.indices.create(params).then(() => switchAlias(null, name))
}

export const createTemplate = async (config: string) => {
  const templateName = 'template-is'
  logger.info('Create template', templateName)
  const client = await esService.getClient()
  return client.indices
    .putTemplate({
      name: templateName,
      body: config,
    })
    .catch((error) => {
      logger.error('Failed to update template', {
        error,
        config,
        templateName,
      })
      throw error
    })
}

const esGetOlderVersionIndex = async (
  currentVersion: number,
): Promise<string | null> => {
  logger.info('Trying to find older indexes')

  for (let i = currentVersion - 1; i > 0; i--) {
    const indexExists = await esHasVersion(i)
    if (indexExists) {
      // this old version exists, return the name of the index
      return getIndexNameForVersion(i)
    }
  }

  logger.info('No older indice found')
  // no index found
  return null
}