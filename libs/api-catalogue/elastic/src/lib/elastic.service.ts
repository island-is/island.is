import { Injectable } from '@nestjs/common'
import { Client, ApiResponse } from '@elastic/elasticsearch'
import * as AWS from 'aws-sdk'
import AwsConnector from 'aws-elasticsearch-connector'
import { Service } from '@island.is/api-catalogue/types'
import { SearchResponse } from '@island.is/shared/types'
import { searchQuery } from './queries/search.model'
import { logger } from '@island.is/logging'
import {
  Bulk,
  CatAliases,
  CatIndices,
  DeleteByQuery,
  IndicesDelete,
  IndicesUpdateAliases,
} from '@elastic/elasticsearch/api/requestParams'
import { ElasticConfigService } from './elasticconfig.service'

@Injectable()
export class ElasticService {
  private client: Client | null
  private elasticNode: string
  private aliasName: string

  constructor(private config: ElasticConfigService) {
    this.elasticNode = config.getElasticNode()
    this.aliasName = config.getAliasName()
    this.client = null

    //To trigger error if values are not set
    logger.info(
      `--- elastic config ${JSON.stringify(
        { elasticNode: this.getElasticNode(), aliasName: this.getAliasName() },
        null,
        4,
      )}`,
    )
  }

  private getClient() {
    if (!this.client) {
      this.client = this.createEsClient()
    }
    return this.client
  }

  /**
   * Set the alias name and prefix url.
   *
   * @param {string} [aliasName=this.getAliasName()] - Name of the index to use as default.
   * @param {string} [elasticNote] - Prefix on url for every elastic client request.
   * @memberof ElasticService
   */
  init(aliasName: string = this.getAliasName(), elasticNote?: string) {
    this.aliasName = aliasName
    logger.info(
      `ElasticSearch default search alias name ${this.getAliasName()}`,
    )
    if (elasticNote) {
      this.elasticNode = elasticNote
      logger.info(`ElasticSearch base url ${this.getElasticNode()}`)
    }
  }

  /**
   * Tries to delete the index.
   * If the index does not exists it does nothing.
   */
  async deleteIndex(indexName: string): Promise<void> {
    logger.info(`deleteIndex`)

    if (!indexName) throw new Error('Index name missing')
    const { body } = await this.getClient().indices.exists({
      index: indexName,
    })
    logger.debug(`body: ${JSON.stringify(body, null, 4)}`)
    if (body) {
      logger.info(`deleting ${indexName}`)
      await this.getClient().indices.delete({ index: indexName })
      logger.info(`Index ${indexName} deleted`)
    } else {
      logger.info(`No need to delete Index ${indexName}, it does not exist`)
    }
  }

  /**
   * returns all index names a specified alias points to.
   *
   * @param {string} aliasName - Name of the alias to query
   * @returns  - array of string
   * @memberof ElasticService
   */
  async fetchIndexNamesFromAlias(
    aliasName: string,
  ): Promise<string[] | undefined> {
    interface Item {
      alias: string
      index: string
    }

    if (!aliasName) {
      throw new Error('getIndexNamesFromAlias, alias name is missing')
    }

    const ret = await this.getClient()
      .cat.aliases({ h: 'alias,index', format: 'json' })
      .then((result) => {
        if (result && result.body) {
          const indices: string[] = []
          const list: Array<Item> = result.body as Array<Item>
          list.forEach((item) => {
            if (item.index && item.alias === aliasName) indices.push(item.index)
          })
          return indices
        }
      })

    return ret
  }
  async fetchAllAliases(options: CatAliases = { format: 'json' }) {
    return await this.getClient()
      .cat.aliases(options)
      .then((result) => result?.body)
  }

  async fetchAllAliasNames(): Promise<string[]> {
    interface Item {
      alias: string
    }

    let aliasesNames: Array<string> = []
    const body = await this.fetchAllAliases({ h: 'alias', format: 'json' })
    aliasesNames = body?.map((item: Item) => item.alias)

    return aliasesNames
  }

  async fetchAllIndices(options: CatIndices = { format: 'json' }) {
    return await this.getClient()
      .cat.indices(options)
      .then((result) => result?.body)
  }
  async fetchAllIndexNames(): Promise<string[]> {
    interface Item {
      index: string
    }

    return await this.fetchAllIndices({ h: 'index', format: 'json' }).then(
      (resultBody) => {
        let arr: Array<string> = []
        arr = resultBody?.map((item: Item) => item.index)
        return arr
      },
    )
  }

  getAliasName() {
    if (!this.aliasName) throw new Error('alias name not set')

    return this.aliasName
  }

  getElasticNode() {
    if (!this.elasticNode) throw new Error('elastic node not set')

    return this.elasticNode
  }

  async updateIndexAliases(updateOptions: IndicesUpdateAliases) {
    logger.debug(
      `updateAliases updateOptions ${JSON.stringify(updateOptions, null, 4)}`,
    )
    return await this.getClient().indices.updateAliases(updateOptions)
  }

  async deleteIndices(indicesDeleteOptions: IndicesDelete) {
    logger.debug(
      `deleting indices ${JSON.stringify(indicesDeleteOptions, null, 4)}`,
    )
    //IndicesDelete
    return await this.getClient().indices.delete(indicesDeleteOptions)
  }

  /**
   * Inserts one or more services into elastic search
   *
   * @param {Array<Service>} services - Services to insert
   * @param {string} index - Name of the index to insert to
   * @param {boolean} [forceRefresh=false] - Elasticsearch refreshes the affected shards to make this operation visible to search
   * @returns {Promise<boolean>}
   */
  async bulk(
    services: Array<Service>,
    index: string,
    forceRefresh: boolean = false,
  ): Promise<boolean> {
    if (!index) {
      logger.debug('Bulk index name missing.')
      return false
    }

    logger.info(
      `Bulk inserting ${services.length} service${
        services.length !== 1 ? 's' : ''
      } into index "${index}"`,
    )

    if (services.length) {
      const bulk: Array<any> = []
      services.forEach((service) => {
        bulk.push({
          index: {
            _index: index,
            _id: service.id,
          },
        })
        bulk.push(service)
      })

      const param: Bulk = {
        body: bulk,
        index: index,
      }

      if (forceRefresh) {
        param.refresh = 'true'
      }

      const res = await this.getClient()
        .bulk(param)
        .then(() => true)
        .catch(() => false)
      if (res) {
        return res
      }
    } else {
      logger.debug('nothing to bulk insert')
    }
    return false
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

  async fetchById(
    id: string,
    index: string = this.getAliasName(),
  ): Promise<ApiResponse<SearchResponse<Service>>> {
    logger.info('Fetch by id')
    const requestBody = {
      query: { bool: { must: { term: { _id: id } } } },
    }
    return this.search<SearchResponse<Service>, typeof requestBody>(
      requestBody,
      index,
    )
  }

  /**
   * Fetches first n ids from a index
   *
   * @param index
   * @param maxCount - maximum count of ids to return
   */
  async fetchAllIds(
    index: string,
    maxCount: number = 1000,
  ): Promise<Array<string>> {
    logger.info('Fetch all Ids')
    const requestBody = {
      size: maxCount,
      _source: false,
      query: {
        match_all: {},
      },
    }

    return await this.search<SearchResponse<any>, typeof requestBody>(
      requestBody,
      index,
    ).then((res) => {
      let arr: Array<string> = []
      arr = res?.body?.hits?.hits?.map((item) => item._id)
      return arr
    })
  }

  async search<ResponseBody, RequestBody>(
    query: RequestBody,
    index: string = this.getAliasName(),
  ) {
    logger.debug(`Searching "${index}" for `, query)
    return await this.getClient().search<ResponseBody, RequestBody>({
      body: query,
      index: index,
    })
  }

  async deleteByIds(ids: Array<string>, indexName: string) {
    if (!ids.length) {
      return
    }

    if (!indexName) {
      throw new Error('deleteByIds, index name missing')
    }

    const params: DeleteByQuery = {
      index: indexName,
      body: {
        query: {
          ids: {
            values: ids,
          },
        },
      },
    }

    logger.info('Deleting based on ids', { ids })
    return await this.getClient().delete_by_query(params)
  }

  async deleteAllExcept(
    excludeIds: Array<string>,
    indexName: string = this.getAliasName(),
  ) {
    if (!indexName) {
      throw new Error('deleteAllExcept, index name missing')
    }
    logger.info('Deleting everything except', { excludeIds })
    return await this.getClient().delete_by_query({
      index: indexName,
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
    const result = await this.getClient()
      .ping()
      .catch((error) => {
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
        node: this.getElasticNode(),
      })
    }

    return new Client({
      ...AwsConnector(AWS.config),
      node: this.getElasticNode(),
    })
  }

  /**
   *  Fetches services from a index that match given ids
   *
   * @param {string} [index=this.getAliasName()]
   * @param {string[]} serviceIds - pass null to fetch all services
   * @param limit - only used when serviceIds is null
   * @returns {Promise<Service[]>}
   */

  async fetchServices(
    index: string = this.getAliasName(),
    serviceIds: string[] | null,
    limit: number = 100,
  ): Promise<Service[]> {
    const maxSize = serviceIds ? serviceIds.length : limit
    logger.info(`Fetching ${maxSize} services from ${index}`)
    const requestBody = {
      size: maxSize,
      _source: true,
      query: {},
    }

    if (serviceIds) {
      requestBody.query = {
        ids: { values: serviceIds },
      }
    } else {
      requestBody.query = {
        match_all: {},
      }
    }

    return await this.search<SearchResponse<Service>, typeof requestBody>(
      requestBody,
      index,
    )
      .then((result) => {
        let arr: Service[] = []
        if (result?.body?.hits?.hits?.length) {
          arr = result?.body?.hits?.hits?.map((item) => item._source)
        }
        return arr
      })
      .catch((err) => {
        logger.debug(`fetchServices error `, err)
        return []
      })
  }
}
