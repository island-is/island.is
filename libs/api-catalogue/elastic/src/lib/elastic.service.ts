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
import {
  CatAliases,
  CatIndices,
} from '@elastic/elasticsearch/api/requestParams'

const { elastic } = elasticEnvironment

@Injectable()
export class ElasticService {
  private client: Client
  private aliasName: string =
    process.env.XROAD_COLLECTOR_ALIAS || 'apicatalogue'
  private workerIndexName: string | null = null
  private environment: Environment | null = null

  constructor() {
    this.client = this.createEsClient()
  }

  initWorker(
    environment: Environment,
    aliasName: string = this.getAliasName(),
  ) {
    this.environment = environment
    this.aliasName = aliasName
    this.workerIndexName = null
    logger.debug(`Worker index name "${this.getWorkerIndexName()}"`)
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
  async getAliasIndexNames(aliasName: string): Promise<string[] | undefined> {
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
  async getAllAliases(options: CatAliases = { format: 'json' }) {
    return await this.client.cat.aliases(options).then((result) => result?.body)
  }

  async getAllAliasNames(): Promise<string[]> {
    interface Item {
      alias: string
    }

    const aliasesNames: Array<string> = []
    const body = await this.getAllAliases({ h: 'alias', format: 'json' })
    if (body) {
      const list = body as Array<Item>
      list.forEach((item) => {
        if (item.alias) aliasesNames.push(item.alias)
      })
    }

    return aliasesNames
  }

  async getAllIndices(options: CatIndices = { format: 'json' }) {
    return await this.client.cat.indices(options).then((result) => result?.body)
  }
  async getAllIndexNames() {
    interface Item {
      index: string
    }

    const indices: Array<string> = []
    const body = await this.getAllIndices({ h: 'index', format: 'json' })
    if (body) {
      const list = body as Array<Item>
      list.forEach((item) => {
        if (item.index) indices.push(item.index)
      })
    }

    return indices
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
  getWorkerIndexName(): string {
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
    //todo: we need delete index because we are changing it to a alias
    //todo: remove next line when this index has been deleted in all environments
    this.deleteIndex(this.getAliasName())

    logger.info(`Updating alias: "${this.getWorkerPrefix()}"`)
    logger.debug(`All aliases ${await this.getAllAliasNames()}`)

    const oldIndices = await this.getAliasIndexNames(this.getWorkerPrefix())
    logger.debug(`old indices: ${oldIndices}`)
    const updateOptions: any = {
      body: {
        actions: [
          {
            add: {
              index: this.getWorkerIndexName(),
              alias: this.getWorkerPrefix(),
            },
          },
          {
            add: {
              index: this.getWorkerIndexName(),
              alias: this.getAliasName(),
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
  async bulk(services: Array<Service>, indexName: string): Promise<void> {
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
    await this.bulk(services, this.getWorkerIndexName())
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

  async fetchAllIds(
    index: string = this.getAliasName(),
  ): Promise<Array<string>> {
    logger.info('Fetch all Ids')
    const requestBody = {
      _source: false,
      query: {
        match_all: {},
      },
    }

    return await this.search<SearchResponse<any>, typeof requestBody>(
      requestBody,
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
    logger.debug('Searching for', query)
    return await this.client.search<ResponseBody, RequestBody>({
      body: query,
      index: index,
    })
  }

  async deleteByIds(ids: Array<string>) {
    if (!ids.length) {
      return
    }

    logger.info('Deleting based on indexes', { ids })
    return await this.client.delete_by_query({
      index: this.getAliasName(),
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
      index: this.getAliasName(),
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

  /**
   * Gets environments other than current environment
   *
   * @private
   * @returns {Environment[]}
   */
  private getOtherEnvironments(): Environment[] {
    return Object.values(Environment).filter((value) => {
      if (value !== this.getEnvironment()) {
        return value as Environment
      }
    })
  }

  /**
   * Checks if a collector is currently running in the given environment
   *
   * @private
   * @param {Environment} environment
   * @returns {boolean}
   */
  private isCollectorRunning(environment: Environment): boolean {
    // todo: check if alias "xroadcollector_working" exists on given environment
    // if "xroadcollector_working" exits return true
    // if "xroadcollector_working" exits return false
    if (environment === Environment.STAGING) return false
    return true
  }

  /**
   * Waits until a collector finishes running one of the given environments.
   *
   * @param {Environment[]} environments
   * @param {number} [checkIntervalMilliseconds=1000]
   * @param {number} [maxWaitTimeMilliseconds=10000]
   * @returns {Environment|null} - Returns Environment if collector is not running in that environment.
                                 - null: If collector is still running in all given environments and max wait time is reached.
   */
  private waitForCollectorEnvironment(
    environments: Environment[],
    checkIntervalMilliseconds: number = 1000,
    maxWaitTimeMilliseconds: number = 10000,
  ): Environment | null {
    if (!environments || !environments.length) {
      return null
    }

    let now = Date.now()
    let checkDate = now + checkIntervalMilliseconds
    const maxWait = now + maxWaitTimeMilliseconds

    while (now < maxWait && now < checkDate) {
      for (let i = 0; i < environments.length; i++) {
        if (!this.isCollectorRunning(environments[i])) return environments[i]
      }

      while (now < checkDate) {
        now = Date.now()
      }
      checkDate = now + checkIntervalMilliseconds
    }

    return null
  }

  /**
   * Copies values from a environment located on a different cluster
   * into the worker index.
   *
   * @private
   * @param {Environment} environment
   */
  private async copyValuesFromEnvironment(environment: Environment) {
    //todo: copy values from other environment cluster

    // get id of all services in worker index
    //const localIds = await this.fetchAllIds()
    const localIds = ['one', 'two', 'three', 'four', 'five']

    // get ids of all services stored on the other cluster
    const externalIds = ['two', 'three', 'six', 'seven']

    //find out which services we will need to create in worker index
    const commonIds = externalIds.filter((id) => localIds.includes(id))

    //find out which services we will need to merge from external to worker index
    const externalUnique = externalIds.filter((id) => !commonIds.includes(id))
    logger.debug(`localIds   : ${localIds}`)
    logger.debug(`externalIds   : ${externalIds}`)
    logger.debug(`externalUnique   : ${externalUnique}`)
    logger.debug(`commonIds   : ${commonIds}`)
    // get id of all services on other environment
    // localIds = get all ids that only exist locally
    // externalIds = get all ids exist in other
    // onlyExternal = get all ids that only exist in other
    //

    // if id exists locally and in other
    //  merge values from other to local object

    // if id exits only in other create service in local local

    logger.warning('todo: copyValuesFromEnvironment  ' + environment)
  }

  /**
   *  Copies values from other environments into worker index
   *
   */
  copyValuesFromOtherEnvironments() {
    logger.info(
      `Copying values from other environments to :${this.environment}`,
    )

    let environments = this.getOtherEnvironments()
    logger.info(`Environments to copy from: ${environments}`)

    let environment = this.waitForCollectorEnvironment(environments)
    while (environment) {
      this.copyValuesFromEnvironment(environment)
      environments = environments.filter((e) => e !== environment)
      environment = this.waitForCollectorEnvironment(environments)
    }
  }
}
