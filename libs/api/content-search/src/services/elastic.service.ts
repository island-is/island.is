import { Client } from '@elastic/elasticsearch'
import { SearchIndexes } from '../types'
import esb, { RequestBodySearch, TermsAggregation } from 'elastic-builder'
import { logger } from '@island.is/logging'
import merge from 'lodash/merge'
import { environment } from '../environments/environment'
import * as AWS from 'aws-sdk'
import * as AwsConnector from 'aws-elasticsearch-connector'
import { Injectable } from '@nestjs/common'
import { WebSearchAutocompleteInput } from '@island.is/api/schema'
import {
  autocompleteTerm,
  AutocompleteTermResponse,
  AutocompleteTermRequestBody,
} from '../queries/autocomplete'

const { elastic } = environment
interface SyncRequest {
  add: any[]
  remove: string[]
}
@Injectable()
export class ElasticService {
  private client: Client
  constructor() {
    logger.debug('Created ES Service')
  }

  async index(index: SearchIndexes, document: any) {
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

  async bulk(index: SearchIndexes, documents: SyncRequest) {
    logger.info('Processing documents', {index, added: documents.add.length, removed: documents.remove.length})
    
    const requests = []
    // if we have any documents to add add them to the request
    if (documents.add.length) {
      documents.add.forEach(({_id, ...document}) => {
        logger.info('Adding document to request', {_id})
        requests.push({
          index: { _index: index, _id }
        })
        requests.push(document)
        return requests
      })
    }

    // if we have any documents to remove add them to the request
    if (documents.remove.length) {
      documents.remove.forEach((_id) => {
        requests.push({
          delete: { _index: index, _id }
        })
      })
    }

    // if we have any requests execute them
    if (requests.length) {
      try {
        const client = await this.getClient()
        const reaponse = await client.bulk({
          index: index,
          body: requests,
        })
        // TODO: Errors on index might not throw, log those errors here
      } catch (e) {
        ElasticService.handleError(
          'Error indexing ES documents',
          { index: index },
          e,
        )
      }
    } else {
      logger.info('No requests to execute')
    }
  }


  async findByQuery<ResponseBody, RequestBody>(
    index: SearchIndexes,
    query: RequestBody,
  ) {
    try {
      const client = await this.getClient()
      return client.search<ResponseBody, RequestBody>({
        body: query,
        index,
      })
    } catch (e) {
      ElasticService.handleError(
        'Error in ElasticService.findByQuery',
        { query, index },
        e,
      )
    }
  }

  /*
  Reason for deprecation:
  We are runnig elasticsearch 7.4
  Elastic builder is compatable with 6 alpha as stated on:
  https://www.npmjs.com/package/elastic-builder (at the time of writing)
  We are keeping this function until elastic builder has been phased out
  */
  async deprecatedFindByQuery(index: SearchIndexes, query) {
    try {
      const client = await this.getClient()
      return client.search({
        index: index,
        body: query,
      })
    } catch (e) {
      ElasticService.handleError(
        'Error in ElasticService.deprecatedFindByQuery',
        { query: query, index: index },
        e,
      )
    }
  }

  async query(index: SearchIndexes, query) {
    const requestBody = new RequestBodySearch()
    const must = []
    // TODO: Seperate search functionality and basic content actions e.g. get by slug/id 
    // TODO: Make this use the new query format
    // TODO: Make this search tags and types
    if (query?.queryString) {
      requestBody.query(
        esb
          .queryStringQuery(`*${query.queryString}*`)
          .fields([
            'title.stemmed^10',
            'content.stemmed^2'
          ])
          .analyzeWildcard(true),
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
        requestBody.from((query.page - 1) * query.size)
      }
    }

    return this.deprecatedFindByQuery(index, requestBody)
  }

  async fetchCategories(index: SearchIndexes) {
    const query = new RequestBodySearch()
      .agg(new TermsAggregation('categories', 'category'))
      .agg(new TermsAggregation('catagories_slugs', 'category_slug'))
      .size(0)

    try {
      return this.deprecatedFindByQuery(index, query)
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

    return this.deprecatedFindByQuery(index, requestBody)
  }

  async fetchAutocompleteTerm(
    index: SearchIndexes,
    input: Omit<WebSearchAutocompleteInput, 'language'>,
  ): Promise<AutocompleteTermResponse> {
    const { singleTerm: prefix, size } = input
    const requestBody = autocompleteTerm({ prefix, size })

    const data = await this.findByQuery<
      AutocompleteTermResponse,
      AutocompleteTermRequestBody
    >(index, requestBody)

    return data.body
  }

  async deleteByIds(index: SearchIndexes, ids: Array<string>) {
    // In case we get an empty list, ES will match that to all records... which we don't want to delete
    if (!ids.length) {
      return
    }
    const client = await this.getClient()
    return client.delete_by_query({
      index: index,
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

  async deleteAllExcept(index: SearchIndexes, excludeIds: Array<string>) {
    const client = await this.getClient()

    return client.delete_by_query({
      index: index,
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
      ElasticService.handleError('Error in ping', {}, error)
    })
    logger.info('Got elasticsearch ping response')
    return result
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
