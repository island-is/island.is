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
  DeleteByQuery,
  Reindex,
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
    logger.info(`deleteIndex`)

    if (!indexName) throw new Error('Index name missing')
    const { body } = await this.client.indices.exists({
      index: indexName,
    })
    logger.debug(`body: ${JSON.stringify(body, null, 4)}`)
    if (body) {
      logger.info(`deleting ${indexName}`)
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
  async fetchAliasIndexNames(aliasName: string): Promise<string[] | undefined> {
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
  async fetchAllAliases(options: CatAliases = { format: 'json' }) {
    return await this.client.cat.aliases(options).then((result) => result?.body)
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
    return await this.client.cat.indices(options).then((result) => result?.body)
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

  /**
   * Deletes all indices with names, that start with current alias name
   * + current environment, that do not belong to the associated alias.
   *
   * See: getWorkerPrefix() for more info on naming convention.
   *
   */
  async deleteDanglingIndices() {
    logger.debug('Delete dangling indices started')
    const indices = await this.fetchAllIndexNames()
    if (indices) {
      const activeIndices = await this.fetchAliasIndexNames(
        this.getWorkerPrefix(),
      )
      logger.debug('activeIndices', activeIndices)

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
      } else {
        logger.debug(`No dangling indices to delete.`)
      }
    }
    logger.debug('Delete dangling indices finished')
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

    logger.info(`Updating alias: "${this.getWorkerPrefix()}"`)

    const allAliases = await this.fetchAllAliasNames()
    logger.debug(`All aliases ${allAliases}`)

    if (!allAliases.indexOf(this.getAliasName())) {
      //todo: We are on a old environment where a index with current alias name exists.
      logger.info(
        'Todo: Remove this after it has been run on all environments.',
      )
      logger.info(
        `Deleting index "${this.getAliasName()}" so we can use that name as an alias.`,
      )
      await this.deleteIndex(this.getAliasName()).catch((err) => {
        logger.debug(
          `Index name does not exist, it is an alias and thats how we like it.${err}.`,
        )
      })
    }

    const oldIndices = await this.fetchAliasIndexNames(this.getWorkerPrefix())
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
    return await this.client.search<ResponseBody, RequestBody>({
      body: query,
      index: index,
    })
  }

  async deleteByIds(
    ids: Array<string>,
    indexName: string = this.getAliasName(),
  ) {
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
    return await this.client.delete_by_query(params)
  }

  async deleteAllExcept(
    excludeIds: Array<string>,
    indexName: string = this.getAliasName(),
  ) {
    if (!indexName) {
      throw new Error('deleteAllExcept, index name missing')
    }
    logger.info('Deleting everything except', { excludeIds })
    return await this.client.delete_by_query({
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
    return false
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
  private async waitForCollectorToFinishOnOtherCluster(
    environments: Environment[],
    checkIntervalMilliseconds: number = 1000,
    maxWaitTimeMilliseconds: number = 10000,
  ): Promise<Environment | null> {
    if (!environments || !environments.length) {
      return null
    }

    const pause = (delay: number) => {
      return new Promise(function (resolve) {
        setTimeout(resolve, delay)
      })
    }

    let now = Date.now()
    const maxWait = now + maxWaitTimeMilliseconds

    while (now < maxWait) {
      for (let i = 0; i < environments.length; i++) {
        if (!this.isCollectorRunning(environments[i])) {
          return environments[i]
        }
      }
      await pause(checkIntervalMilliseconds)
      now = Date.now()
    }

    logger.debug(
      'waitForCollectorToFinishOnOtherClusters timed out, that is, MaxWait reached!',
    )
    return null
  }

  /**
   * Copies values from a environment located on a different cluster
   *
   * @private
   * @param {Environment} environment
   */
  private async copyRemoteValues(environment: Environment) {
    //todo: copy values from other environment cluster
    logger.info(`Copying values from ${environment}`)
    const externalIndex = `${this.getAliasName()}_${environment}`
    const externalIds = await this.fetchAllIds(externalIndex)

    if (!externalIds || !externalIds.length) {
      return //nothing to do
    }

    // get id of all services in current environment
    const localIds = await this.fetchAllIds(this.getWorkerIndexName())
    //Find services that will need to be merged from external to current environment
    const commonIds = externalIds.filter((id) => localIds.includes(id))

    //find services that will need to be created in current environment
    const externalUnique = externalIds.filter((id) => !localIds.includes(id))

    logger.debug(`localIds   : ${localIds}`)
    logger.debug(`externalIds   : ${externalIds}`)
    logger.debug(`commonIds   : ${commonIds}`)
    logger.debug(`externalUnique   : ${externalUnique}`)

    logger.debug(
      `todo: add merge services with following ids to "${environment}"`,
      commonIds,
    )
    logger.debug(
      `todo: add services with following ids to "${environment}"`,
      externalUnique,
    )

    return
  }

  /**
   *  Copies values from other environments into worker index
   *
   */
  async copyValuesFromOtherEnvironments() {
    logger.info('`Copying values from other environments')
    const otherEnvironments = this.getOtherEnvironments()
    logger.debug(
      `Copying values from other environments to`,
      this.getEnvironment(),
    )
    logger.info(
      `Environments to copy from: ${JSON.stringify(
        otherEnvironments,
        null,
        4,
      )}`,
    )

    let environment = await this.waitForCollectorToFinishOnOtherCluster(
      otherEnvironments,
    )
    while (environment) {
      logger.debug(
        `processing "${environment}", environments:"${otherEnvironments}"`,
      )
      await this.copyRemoteValues(environment)

      otherEnvironments.splice(otherEnvironments.indexOf(environment), 1)

      environment = await this.waitForCollectorToFinishOnOtherCluster(
        otherEnvironments,
      )
    }

    logger.info(`Copying values from other environments finished`)
  }

  async reIndex(
    sourceIndexName: string,
    destIndexName: string,
    scriptSource: string = '',
  ) {
    type Param = Reindex & {
      body: {
        script?: {
          lang: string
          source: string
        }
      }
    }

    const param: Param = {
      wait_for_completion: true,
      refresh: true,
      body: {
        source: { index: sourceIndexName },
        dest: { index: destIndexName },
      },
    }
    if (scriptSource) {
      param.body.script = {
        lang: 'painless',
        source: scriptSource,
      }
    }
    console.log(param)
    try {
      await this.client.reindex(param)
    } catch (err) {
      logger.error(`error : ${JSON.stringify(err, null, 4)}`)
    }
  }

  /**
   * Copies values from source index to other environment indexes
   *
   * @param {string} sourceIndex
   * @param {Environment[]} environments
   * @memberof ElasticService
   */
  async createMocks(sourceIndex: string, environments: Environment[]) {
    let instance: string

    logger.debug('-- Creating mocks started  -- ')
    //Copying values from source index and inserting
    // modified data into destination indices
    for (let i = 0; i < environments.length; i++) {
      const environment = environments[i]
      switch (environment) {
        case Environment.DEV:
          instance = 'IS-DEV'
          break
        case Environment.STAGING:
          instance = 'IS-TEST'
          break
        case Environment.PROD:
          instance = 'IS'
          break
      }

      const newIndex = `${this.getAliasName()}_${environment}`
      logger.debug(`deleting index ${newIndex}`)
      await this.deleteIndex(newIndex)
      logger.debug(
        `copying all from index "${sourceIndex}" to index "${newIndex}"`,
      )
      logger.debug(
        're-indexing and replacing field values "environment and details[0].xroadIdentifier.instance" in first record of environments',
      )
      await this.reIndex(
        sourceIndex,
        newIndex,
        `ctx._source.environments[0].environment = '${environment}';ctx._source.environments[0].details[0].xroadIdentifier.instance = '${instance}'`,
      )
        .then(() => {
          logger.debug(`Re-indexing done!`)
        })
        .catch((err) =>
          logger.info(`Re index error ${JSON.stringify(err, null, 4)}`),
        )
    }

    logger.debug(`Done cloning environments: "${environments}"`)
    logger.debug(
      `Removing first three services from source index named ${sourceIndex}`,
    )
    const idsToRemoveFromSourceIndex = (
      await this.fetchAllIds(sourceIndex)
    ).slice(0, 3)
    await this.deleteByIds(idsToRemoveFromSourceIndex, sourceIndex)
      .then((res) =>
        logger.debug('deleteById successful', JSON.stringify(res, null, 4)),
      )
      .catch((err) => logger.debug('deleteById error', err))

    for (let i = 0; i < environments.length; i++) {
      const environment = environments[i]
      const newIndex = `${this.getAliasName()}_${environment}`
      const delCount = 2 * (i + 1)
      logger.debug(
        `Removing last ${delCount} services from cloned environment index "${newIndex}"`,
      )
      const idsToRemoveFromNewIndex = (await this.fetchAllIds(newIndex)).slice(
        delCount * -1,
      )
      logger.debug(
        `Deleting service with ids: "${idsToRemoveFromNewIndex}"  from ${newIndex}`,
      )
      await this.deleteByIds(idsToRemoveFromNewIndex, newIndex)
        .then((res) =>
          logger.debug('deleteById successful', JSON.stringify(res, null, 4)),
        )
        .catch((err) => logger.debug('deleteById error', err))
    }
    logger.debug('-- Creating mocks finished -- ')
  }
}
