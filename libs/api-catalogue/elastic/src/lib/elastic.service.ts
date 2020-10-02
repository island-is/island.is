import { Injectable } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'
import * as AWS from 'aws-sdk'
import * as AwsConnector from 'aws-elasticsearch-connector'
import { environment } from '../environments/environments'
import { Service } from '@island.is/api-catalogue/types'
import { RequestBody } from '@elastic/elasticsearch/lib/Transport'
import { SearchResponse } from './types/types.model'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { searchQuery } from './queries/search.model'
//import { logger } from '@island.is/logging'

const { elastic } = environment

@Injectable()
export class ElasticService {
  private client: Client
  private indexName = 'apicatalogue'

  async deleteIndex() {
    console.log('Deleting index')

    try {
      const client = await this.getClient()
      return client.indices.delete({ index: this.indexName })
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
    }
  }

  async index(service: Service) {
    console.log('Indexing', service)

    try {
      const client = await this.getClient()
      return await client.index({
        id: service.id,
        index: this.indexName,
        body: service,
      })
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
    }
  }

  async bulk(services: Array<Service>) {
    console.log('Bulk insert', services)

    if (services.length) {
      const bulk = []
      services.forEach((service) => {
        bulk.push({
          index: { _index: this.indexName },
        })
        bulk.push(service)
      })
      try {
        const client = await this.getClient()
        return await client.bulk({
          body: bulk,
          index: this.indexName,
        })
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
      }
    }

    console.log('nothing to bulk insert')
  }

  async fetchAll(
    limit: number,
    searchAfter?: string[],
    query?: string,
    pricing?: PricingCategory[],
    data?: DataCategory[],
    type?: TypeCategory[],
    access?: AccessCategory[],
  ) {
    console.log('Fetch paginated results')

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

  async fetchById(id: string) {
    console.log('Fetch by id', id)
    return this.search<SearchResponse<Service>, RequestBody>({
      query: { bool: { must: { term: { id: id } } } },
    })
  }

  async search<ResponseBody, RequestBody>(query: RequestBody) {
    console.log('Searching for', JSON.stringify(query, null, 2))
    try {
      const client = await this.getClient()
      return client.search<ResponseBody, RequestBody>({
        body: query,
        index: this.indexName,
      })
    } catch (error) {
      console.log(error)
    }
  }

  async deleteByIds(ids: Array<string>) {
    if (!ids.length) {
      return
    }
    const client = await this.getClient()
    return client.delete_by_query({
      index: this.indexName,
      body: {
        query: {
          bool: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            must: ids.map((id) => ({ match: { _id: id } })),
          },
        },
      },
    })
  }

  async deleteAllExcept(excludeIds: Array<string>) {
    const client = await this.getClient()

    return client.delete_by_query({
      index: this.indexName,
      body: {
        query: {
          bool: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            must_not: excludeIds.map((id) => ({ match: { _id: id } })),
          },
        },
      },
    })
  }

  async ping() {
    const client = await this.getClient()
    const result = await client.ping().catch((error) => {
      console.log(error)
    })
    console.log('Got elasticsearch ping response')
    return result
  }

  async getClient(): Promise<Client> {
    if (this.client) {
      return this.client
    }
    this.client = await this.createEsClient()
    return this.client
  }

  async createEsClient(): Promise<Client> {
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
