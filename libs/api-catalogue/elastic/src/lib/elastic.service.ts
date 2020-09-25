import { Injectable } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'
import * as AWS from 'aws-sdk'
import * as AwsConnector from 'aws-elasticsearch-connector'
import { environment } from '../environments/environments'
import { Service } from '@island.is/api-catalogue/types'
//import { logger } from '@island.is/logging'

const { elastic } = environment

@Injectable()
export class ElasticService {
  private client: Client
  private indexName = 'apicatalogue'

  async index(service: Service) {
    console.log('service', service)

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

  async search<ResponseBody, RequestBody>(query: RequestBody) {
    try {
      console.log(query)
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
