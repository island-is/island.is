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
  private aliasName: string | null = null
  private workerIndexName: string | null = null
  private environment: Environment | null = null

  constructor() {
    this.client = this.createEsClient()
  }

  initWorker(aliasName: string, environment: Environment) {
    if (!aliasName) {
      throw new Error('aliasName cannot be empty')
    }

    this.environment = environment
    this.aliasName = aliasName
    this.workerIndexName = null
    logger.debug(`Worker index name "${this.getIndexNameWorker()}"`)
  }

  /**
   *
   *
   * @private
   * @param {number} number - The value to be formatted
   * @param {number} width - how many characters   should the returned string be
   * @param {string} [prefix='0'] - the prefix character
   * @returns {string}
   * @example
   *   Statement                    Returns
   *   leadingZero(10, 4);          0010
   *   leadingZero(9, 4);           0009
   *   leadingZero(123, 4);         0123
   *   leadingZero(10, 4, '-');     --10
   * @memberof ElasticService
   */
  private leadingZero(
    number: number,
    width: number,
    prefix: string = '0',
  ): string {
    const n: string = number.toString()
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join(prefix) + n
  }

  // returns timestamp on the format 'yyyyMMddHHmmssSSS'
  private GenerateTimestamp() {
    const now = new Date()
    return (
      `${now.getFullYear()}${this.leadingZero(
        now.getMonth() + 1,
        2,
      )}${this.leadingZero(now.getDate(), 2)}` +
      `_${this.leadingZero(now.getHours(), 2)}${this.leadingZero(
        now.getMinutes(),
        2,
      )}${this.leadingZero(now.getSeconds(), 2)}${this.leadingZero(
        now.getMilliseconds(),
        3,
      )}`
    )
  }

  /**
   * Tries to delete the index.
   * If the index does not exists it does nothing.
   */
  async deleteIndex(indexName: string): Promise<void> {
    logger.info('Deleting index')

    const { body } = await this.client.indices.exists({
      index: indexName,
    })
    if (body) {
      await this.client.indices.delete({ index: indexName })
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
  async getAliasIndexNames(aliasName: string) {
    interface Item {
      alias: string
      index: string
    }

    if (!aliasName) {
      throw new Error('getIndexNamesFromAlias, alias name is missing')
    }

    const ret = await this.client.cat
      .aliases({ h: 'alias,index', format: 'json' })
      .then((result) => {
        if (result && result.body) {
          const indices: Array<string> = []
          const list: Array<Item> = result.body as Array<Item>
          list.forEach((item) => {
            if (item.index && item.alias === aliasName) indices.push(item.index)
          })
          return indices
        }
      })

    return ret
  }
  async getAllAliasNames() {
    interface Item {
      alias: string
      index: string
    }

    return await this.client.cat
      .aliases({ h: 'alias', format: 'json' })
      .then((result) => {
        if (result && result.body) {
          const aliasesNames: Array<string> = []
          const list: Array<Item> = result.body as Array<Item>
          list.forEach((item) => {
            if (item.alias) aliasesNames.push(item.alias)
          })
          return aliasesNames
        }
      })
  }

  /**
   * Deletes all indices with names, that start with current alias name
   * + current environment, that do not belong to the associated alias.
   *
   * See: getWorkerPrefix() for more info on naming convention.
   *
   * @memberof ElasticService
   */
  async deleteDanglingIndices() {
    const indices = await this.getAllIndexNames()
    logger.debug('deleteIndicesWithoutAliases -> all indices ' + indices)
    if (indices) {
      const activeIndices = await this.getAliasIndexNames(
        this.getWorkerPrefix(),
      )
      logger.debug(`activeIndices:${activeIndices}`)

      // Get all indices associated with us in this environment except the ones
      // which are being used in current environment alias.
      const workers = indices.filter(
        (e) =>
          e.startsWith(`${this.getWorkerPrefix()}`) &&
          !activeIndices?.includes(e),
      )
      if (workers.length) {
        logger.debug(`deleting indices:  ${JSON.stringify(workers, null, 4)}`)
        await this.client.indices.delete({ index: workers })
      }
    }
  }

  /**
   * Before calling this function, initCollectionValues must have been set
   */
  getEnvironment(): Environment {
    if (!this.environment) throw new Error('No environment set')

    return this.environment as Environment
  }

  /**
   * Before calling this function, initWorker must have been set
   */
  getAliasName() {
    if (!this.aliasName) throw new Error('alias name not set')

    return this.aliasName
  }

  private getWorkerPrefix() {
    return `${this.getAliasName()}-${this.getEnvironment()}`
  }

  /**
   * Before calling this function, initWorker must have been set
   */
  getIndexNameWorker(): string {
    if (!this.workerIndexName) {
      this.workerIndexName = `${this.getWorkerPrefix()}${this.GenerateTimestamp()}`
    }
    return this.workerIndexName as string
  }

  /**
   *  Add the worker index to the alias,
   *  removes the old index from the alias and finally deletes the old index.
   */
  async updateAlias() {
    logger.info(`Updating alias: "${this.getWorkerPrefix()}"`)
    logger.debug(`All aliases ${await this.getAllAliasNames()}`)

    const oldIndices = await this.getAliasIndexNames(this.getWorkerPrefix())
    logger.debug(`old indices: ${oldIndices}`)
    const updateOptions: any = {
      body: {
        actions: [
          {
            add: {
              index: this.getIndexNameWorker(),
              alias: this.getWorkerPrefix(),
            },
          },
        ],
      },
    }

    // Make updateAliases remove all older indices from this alias
    oldIndices?.forEach((name) => {
      updateOptions.body.actions.push({
        remove: {
          index: name,
          alias: this.getWorkerPrefix(),
        },
      })
    })

    logger.debug(
      `updateAliases updateOptions ${JSON.stringify(updateOptions, null, 4)}`,
    )
    await this.client.indices.updateAliases(updateOptions)

    // Delete unused indices.
    if (oldIndices && oldIndices.length) {
      await this.client.indices.delete({ index: oldIndices })
    }
  }

  /**
   * Accepts array of Services to bulk insert into elastic search.
   */
  async bulk(
    services: Array<Service>,
    indexName: string = this.getWorkerPrefix(),
  ): Promise<void> {
    if (!indexName) {
      throw new Error('Bulk index name missing.')
    }
    logger.debug(`Inserting into index ${indexName}`)
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
    } else {
      logger.debug('nothing to bulk insert')
    }
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
      index: this.getWorkerPrefix(),
    })
  }

  async deleteByIds(ids: Array<string>) {
    if (!ids.length) {
      return
    }

    logger.info('Deleting based on indexes', { ids })
    return await this.client.delete_by_query({
      index: this.getWorkerPrefix(),
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
      index: this.getWorkerPrefix(),
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
  async getAllIndexNames() {
    interface Item {
      index: string
    }

    return await this.client.cat
      .indices({ format: 'json', h: ['index'] })
      .then((result) => {
        if (result && result.body) {
          const indices: Array<string> = []
          const list: Array<Item> = result.body as Array<Item>
          list.forEach((item) => {
            if (item.index) indices.push(item.index)
          })
          return indices
        }
      })
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
