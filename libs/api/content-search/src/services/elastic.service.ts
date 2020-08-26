import { Client } from '@elastic/elasticsearch'
import { Document, SearchIndexes } from '../types'
import esb, { RequestBodySearch, TermsAggregation } from 'elastic-builder'
import { logger } from '@island.is/logging'
import merge from 'lodash/merge'
import { environment } from '../environments/environment'
import * as AWS from 'aws-sdk'
import * as AwsConnector from 'aws-elasticsearch-connector'
import { Injectable } from '@nestjs/common'

const { elastic } = environment

@Injectable()
export class ElasticService {
  private client: Client
  constructor() {
    logger.debug('Created ES Service')
  }

  async index(index: SearchIndexes, document: Document) {
    const _id = document._id

    try {
      delete document._id
      const client = await this.getClient()
      return await client.index({
        id: _id,
        index: index,
        body: document,
      })
    } catch (e) {
      ElasticService.handleError(
        'Error indexing ES document',
        { id: _id, index: index },
        e,
      )
    }
  }

  async findByQuery(index: SearchIndexes, query) {
    try {
      const client = await this.getClient()
      return client.search({
        index: index,
        body: query,
      })
    } catch (e) {
      ElasticService.handleError(
        'Error in ElasticService.findByQuery',
        { query: query, index: index },
        e,
      )
    }
  }

  async query(index: SearchIndexes, query) {
    const requestBody = new RequestBodySearch()
    const must = []

    if (query?.queryString) {
      requestBody.query(
        esb
          .queryStringQuery(query.queryString)
          .fields(['title.stemmed^10', 'content.stemmed^2', 'tag.stemmed']),
      )
    }

    if (query?._id) {
      must.push(esb.matchQuery('_id', query.id))
    }
    if (query?.slug) {
      must.push(esb.matchQuery('slug', query.slug))
    }
    if (query?.type) {
      must.push(esb.matchQuery('content_type', query.type))
    }
    if (query?.tag) {
      must.push(esb.termQuery('tag', query.tag))
    }
    if (query?.content) {
      must.push(esb.matchQuery('content', query.content))
    }
    if (query?.title) {
      must.push(esb.matchQuery('title', query.title))
    }

    if (must.length) {
      requestBody.query(esb.boolQuery().must(must))
    }

    if (query?.size) {
      requestBody.size(query.size)

      if (query?.page > 1) {
        requestBody.from(query.page * query.size - query.page)
      }
    }

    return this.findByQuery(index, requestBody)
  }

  async fetchCategories(index: SearchIndexes) {
    const query = new RequestBodySearch()
      .agg(new TermsAggregation('categories', 'category'))
      .agg(new TermsAggregation('catagories_slugs', 'category_slug'))
      .size(0)

    try {
      return this.findByQuery(index, query)
    } catch (e) {
      console.log(e)
    }
  }

  async fetchItems(index: SearchIndexes, input) {
    const requestBody = new RequestBodySearch()
      .query(
        esb.boolQuery().must([esb.matchQuery('category_slug', input.slug)]),
      )
      .size(1000)

    return this.findByQuery(index, requestBody)
  }

  async ping() {
    const client = await this.getClient()
    return client.ping().catch((e) => {
      ElasticService.handleError('Error in ping', {}, e)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handleError(message: string, context: any, error: any) {
    ElasticService.logError(message, context, error)
    throw new Error(message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static logError(message: string, context: any, error: any) {
    const errorCtx = {
      error: {
        message: error.message,
        reason: error.error?.meta?.body?.error?.reason,
        status: error.error?.meta?.body?.status,
        statusCode: error.error?.meta?.statusCode,
      },
    }

    logger.error(message, merge(context, errorCtx))
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

    logger.info('Create AWS ES Client', {
      esConfig: elastic,
      withAWS: hasAWS,
    })

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
