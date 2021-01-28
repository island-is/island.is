import { Injectable } from '@nestjs/common'
import { Client, ApiResponse } from '@elastic/elasticsearch'
import * as AWS from 'aws-sdk'
import * as AwsConnector from 'aws-elasticsearch-connector'
import { environment as elasticEnvironment } from '../environments/environments'
import { Service } from '@island.is/api-catalogue/types'
import { SearchResponse } from '@island.is/shared/types'
import { searchQuery } from './queries/search.model'
import { logger } from '@island.is/logging'
import { Environment } from 'libs/api-catalogue/consts/src/lib/environment'

const { elastic } = elasticEnvironment

@Injectable()
export class ElasticService {
  private client: Client
  private indexName: string
  private indexNameWorker: string
  private environment: Environment = Environment.DEV

  constructor() {
    this.client = this.createEsClient()
    const indexName = process.env.API_CATALOGUE_INDEX_NAME
    if (!indexName) {
      throw new Error(
        `Environment variable "API_CATALOGUE_INDEX_NAME" not set.`,
      )
    }
    this.indexName = indexName as string
    this.indexNameWorker = `${this.indexName}_work`

    const environment = process.env.ENVIRONMENT
    if (!environment) {
      throw new Error(`Environment variable "ENVIRONMENT" not set.`)
    }

    this.setEnvironment(environment)
  }

  private setEnvironment(environment: string | undefined) {
    console.log('setEnvironment -> ' + environment)
    switch (environment) {
      case Environment.PROD:
        this.environment = Environment.PROD
        break
      case Environment.STAGING:
        this.environment = Environment.STAGING
        break
      case Environment.DEV:
        this.environment = Environment.DEV
        break
      default:
        throw new Error(
          `Invalid value in environment variable "ENVIRONMENT". Valid values:[${Environment.DEV}|${Environment.STAGING}|${Environment.PROD}]`,
        )
    }
  }

  /**
   * Tries to delete the index.
   * If the index does not exists it does nothing.
   */
  async deleteIndex(indexName: string = this.indexName): Promise<void> {
    logger.info('Deleting index', indexName)

    const { body } = await this.client.indices.exists({
      index: indexName,
    })
    if (body) {
      await this.client.indices.delete({ index: indexName })
      logger.info(`Index ${indexName} deleted`)
    } else {
      logger.info('No index to delete', indexName)
    }
  }

  async deleteWorkerIndex(): Promise<void> {
    await this.deleteIndex(this.getIndexNameWorker())
  }

  getIndexName() {
    return this.indexName
  }
  getIndexNameWorker() {
    return this.indexNameWorker
  }
  getEnvironment(): Environment {
    return this.environment
  }

  private async getMapping(indexName: string = this.indexName) {
    const response = await this.client.indices.getMapping({
      index: indexName,
    })
    return response
  }

  private async reIndex(src: string, dst: string) {
    const opts: any = { body: { source: { index: src }, dest: { index: dst } } }

    await this.client.reindex(opts)
    logger.info(`Successfully reindexed [${src}] to [${dst}].`)
  }

  /**
   * Moves all values from worker index to the destinationIndex.
   * @param {string} destinationIndex - if not specified the default value is getIndexName()
   */
  async moveWorkerValuesToIndex(destinationIndex: string = this.indexName) {
    const res = await this.getMapping(this.getIndexNameWorker())
    const mappingProperties =
      res?.body[this.getIndexNameWorker()]?.mappings?.properties

    await this.deleteIndex(destinationIndex)
    await this.createIndexIfNotExists(
      destinationIndex,
      //copy mapping properties from worker index
      mappingProperties,
    )

    await this.reIndex(this.getIndexNameWorker(), destinationIndex)
    await this.deleteIndex(this.getIndexNameWorker())
  }

  async createIndexIfNotExists(indexName: string, mappingProperties: any) {
    try {
      await this.client.indices.get({
        index: indexName,
      })
      logger.info(`index "${indexName}" already created`)
    } catch (e) {
      logger.warn(`index "${indexName}" is missing. creating...`)
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: mappingProperties,
          },
        },
      })
      logger.info(`index "${indexName}" created`)
    }
  }

  /**
   * Accepts array of Services to bulk insert into elastic search.
   */
  async bulk(
    services: Array<Service>,
    indexName: string = this.indexName,
  ): Promise<void> {
    logger.info('Bulk insert', services)

    if (services.length) {
      const bulk: Array<any> = []
      services.forEach((service) => {
        bulk.push({
          index: {
            _index: indexName,
            _id: service.id,
          },
        })
        bulk.push(service)
      })

      await this.client.bulk({
        body: bulk,
        index: indexName,
      })
    }

    logger.debug('nothing to bulk insert')
  }

  async bulkWorker(services: Array<Service>) {
    await this.bulk(services, this.getIndexNameWorker())
  }

  async fetchAll(
    //Set the default limit to fetch 25 services
    limit = 25,
    searchAfter?: string[],
    query?: string,
    pricing?: string[],
    data?: string[],
    type?: string[],
    access?: string[],
  ): Promise<ApiResponse<SearchResponse<Service>>> {
    logger.debug('Fetch paginated results')

    const requestBody = searchQuery({
      limit,
      searchAfter,
      query,
      pricing,
      data,
      type,
      access,
    })

    return this.search<SearchResponse<Service>, typeof requestBody>(requestBody)
  }

  async fetchById(id: string): Promise<ApiResponse<SearchResponse<Service>>> {
    logger.info('Fetch by id')
    const requestBody = {
      query: { bool: { must: { term: { _id: id } } } },
    }
    return this.search<SearchResponse<Service>, typeof requestBody>(requestBody)
  }

  async search<ResponseBody, RequestBody>(query: RequestBody) {
    logger.debug('Searching for', query)
    return await this.client.search<ResponseBody, RequestBody>({
      body: query,
      index: this.indexName,
    })
  }

  async deleteByIds(ids: Array<string>) {
    if (!ids.length) {
      return
    }

    logger.info('Deleting based on indexes', { ids })
    return await this.client.delete_by_query({
      index: this.indexName,
      body: {
        query: {
          bool: {
            must: ids.map((id) => ({ match: { _id: id } })),
          },
        },
      },
    })
  }

  async deleteAllExcept(excludeIds: Array<string>) {
    logger.info('Deleting everything except', { excludeIds })
    return await this.client.delete_by_query({
      index: this.indexName,
      body: {
        query: {
          bool: {
            must_not: excludeIds.map((id) => ({ match: { _id: id } })),
          },
        },
      },
    })
  }

  async ping() {
    const result = await this.client.ping().catch((error) => {
      logger.error('Error in ping', error)
    })
    logger.info('Got elasticsearch ping response')
    return result
  }

  private createEsClient(): Client {
    const hasAWS =
      'AWS_WEB_IDENTITY_TOKEN_FILE' in process.env ||
      'AWS_SECRET_ACCESS_KEY' in process.env

    if (!hasAWS) {
      return new Client({
        node: elastic.node,
      })
    }

    return new Client({
      ...AwsConnector(AWS.config),
      node: elastic.node,
    })
  }
}
