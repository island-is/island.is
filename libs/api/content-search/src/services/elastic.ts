import { Client } from '@elastic/elasticsearch'
import { Document, SearchIndexes } from '../types'
import esb, { RequestBodySearch, TermsAggregation } from 'elastic-builder'
import { logger } from '@island.is/logging'
// noinspection ES6PreferShortImport
import { EsClientFactory } from '../clients/esClientFactory'
import merge from 'lodash/merge'

export class ElasticService {
  private client: Client

  async index(index: SearchIndexes, document: Document) {
    const _id = document._id

    try {
      delete document._id
      return await this.getClient().index({
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
      return this.getClient().search({
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
          .fields(['title^10', 'content^2', 'tag']),
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
    const requestBody = new RequestBodySearch().query(
      esb.boolQuery().must([esb.matchQuery('category_slug', input.slug)]),
    )

    return this.findByQuery(index, requestBody)
  }

  async ping() {
    return this.getClient()
      .ping()
      .catch((e) => {
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
      },
    }

    logger.error(message, merge(context, errorCtx))
  }

  private getClient(): Client {
    if (this.client) {
      return this.client
    }
    this.client = EsClientFactory.create()
    return this.client
  }
}
