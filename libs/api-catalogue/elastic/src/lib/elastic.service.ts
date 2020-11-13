import { Injectable } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'
import * as AWS from 'aws-sdk'
import * as AwsConnector from 'aws-elasticsearch-connector'
import { environment } from '../environments/environments'
import { Service } from '@island.is/api-catalogue/types'
import { RequestBody } from '@elastic/elasticsearch/lib/Transport'
import { SearchResponse } from '@island.is/shared/types'
import { searchQuery } from './queries/search.model'
import { logger } from '@island.is/logging'

const { elastic } = environment

@Injectable()
export class ElasticService {
  private client: Client
  private indexName = 'apicatalogue'

  constructor() {
    this.client = this.createEsClient()
  }

  /**
   * Tries to delete the index.
   * If the index does not exists it does nothing.
   */
  async deleteIndex(): Promise<void> {
    logger.info('Deleting index', this.indexName)

    const { body } = await this.client.indices.exists({
      index: this.indexName,
    })
    if (body) {
      await this.client.indices.delete({ index: this.indexName })
      logger.info(`Index ${this.indexName} deleted`)
    } else {
      logger.info('No index to delete', this.indexName)
    }
  }

  async index(service: Service) {
    logger.info('Indexing', service)

    try {
      return await this.client.index({
        id: service.id,
        index: this.indexName,
        body: service,
      })
    } catch (error) {
      logger.error('Error in index', error)
    }
  }

  /**
   * Accepts array of Services to bulk insert into elastic search.
   */
  async bulk(services: Array<Service>): Promise<void> {
    logger.info('Bulk insert', services)

    if (services.length) {
      const bulk: Array<any> = []
      services.forEach((service) => {
        bulk.push({
          index: {
            _index: this.indexName,
            _id: service.id,
          },
        })
        bulk.push(service)
      })

      await this.client.bulk({
        body: bulk,
        index: this.indexName,
      })
    }

    logger.debug('nothing to bulk insert')
  }

  async fetchAll(
    limit?: number,
    searchAfter?: string[],
    query?: string,
    pricing?: string[],
    data?: string[],
    type?: string[],
    access?: string[],
  ): Promise<any> {
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

  async fetchById(id: string): Promise<any> {
    logger.info('Fetch by id')
    return this.search<SearchResponse<Service>, RequestBody>({
      query: { bool: { must: { term: { id: id } } } },
    })
  }

  async search<ResponseBody, RequestBody>(query: RequestBody) {
    logger.debug('Searching for', query)
    try {
      return await this.client.search<ResponseBody, RequestBody>({
        body: query,
        index: this.indexName,
      })
    } catch (error) {
      logger.error('Error in search', error)
    }
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
