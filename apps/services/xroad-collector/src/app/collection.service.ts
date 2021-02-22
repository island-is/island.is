import { Injectable } from '@nestjs/common'
import { ElasticService } from '@island.is/api-catalogue/elastic'

import { Environment } from '@island.is/api-catalogue/consts'
import { logger } from '@island.is/logging'
import { OpenApi, Service } from '@island.is/api-catalogue/types'
import union from 'lodash/union'
import { IndicesUpdateAliases } from '@elastic/elasticsearch/api/requestParams'
import { RequestBody } from '@elastic/elasticsearch/lib/Transport'
import { CollectionConfigService } from './collection-config.service'

@Injectable()
export class CollectionService {
  private environment: Environment
  private aliasName: string
  private workerIndexName: string | null = null
  elasticNode: string

  constructor(
    private collectionConfigService: CollectionConfigService,
    private readonly elasticService: ElasticService,
  ) {
    this.init()
  }

  private init() {
    const config = this.collectionConfigService.getConfig()
    this.environment = config.environment
    this.aliasName = config.aliasName
    this.elasticNode = config.elasticNode
    this.workerIndexName = null

    this.elasticService.init(this.getAliasName(), this.elasticNode)
    logger.debug(`Worker index name "${this.getWorkerIndexName()}"`)
  }

  /**
   * Before calling this function, initWorker must have been set
   */
  getAliasName() {
    if (!this.aliasName) throw new Error('alias name not set')

    return this.aliasName
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
  getWorkerIndexName(): string {
    if (!this.workerIndexName) {
      this.workerIndexName = `${this.getWorkerPrefix()}${this.GenerateTimestamp()}`
    }
    return this.workerIndexName as string
  }

  private getCollectorWorkingName(environment: Environment) {
    return `${this.getPrefix(environment)}CollectorWorking`
  }

  private getPrefix(environment: Environment) {
    return `${this.getAliasName()}-${environment}`
  }
  private getWorkerPrefix() {
    return this.getPrefix(this.getEnvironment())
  }

  /**
   * Creates a prefixed string from a number.
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
  private leadingZero(number: number, width: number, prefix = '0'): string {
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
   *  Add CollectorWorking alias to worker index to report to collectors
   *  on other environments that collection currently running.
   * @memberof ElasticService
   */
  async createCollectorWorkingAlias() {
    const aliases = [this.getCollectorWorkingName(this.getEnvironment())]
    logger.debug(
      `Adding alias "${aliases[0]}" to index ${this.getWorkerIndexName()}.`,
    )
    await this.updateIndexAliases(this.getWorkerIndexName(), aliases, null)
  }

  /**
   * Inserts one or more services into worker index
   *
   * @param {Array<Service>} services
   * @param {boolean} forceRefresh -  Elasticsearch refreshes the affected shards to make this operation visible to search
   */
  async bulkWorker(services: Array<Service>, forceRefresh: boolean) {
    return await this.elasticService.bulk(
      services,
      this.getWorkerIndexName(),
      forceRefresh,
    )
  }

  /**
   * Makes the main alias point to the new worker index so the web can query
   * the new index.  Then the old index.
   *
   */
  async ActivateWorkerIndexForWeb() {
    logger.info('Activating Worker index')

    //Get the old index
    const oldIndices = await this.elasticService.fetchIndexNamesFromAlias(
      this.getAliasName(),
    )

    logger.debug(`old indices: ${oldIndices}`)

    interface Options extends IndicesUpdateAliases {
      body: {
        actions: RequestBody[]
      }
    }

    const updateOptions: Options = {
      body: {
        actions: [],
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
    updateOptions.body.actions.push({
      add: {
        index: this.getWorkerIndexName(),
        alias: this.getAliasName(), //alias
      },
    })

    logger.debug(`updateAliases updateOptions`)
    await this.elasticService.updateIndexAliases(updateOptions)

    // Delete unused indices.
    if (oldIndices && oldIndices.length) {
      logger.info(`deleting indices ${JSON.stringify(oldIndices, null, 4)}`)
      await this.deleteIndices(oldIndices)
    }
  }

  /**
   *  Add a environment alias to the worker index and
   *  removes CollectorWorking alias from worker index so collectors in other
   *  environments know it's save to copy data from the this environment alias.
   *  removes the old index from the alias and finally deletes the old index.
   */
  async ActivateWorkerIndexForRemoteEnvironments() {
    logger.info(`Activating alias: "${this.getWorkerPrefix()}"`)
    const allIndices = await this.elasticService.fetchAllIndices()
    if (allIndices && allIndices.includes(this.getAliasName())) {
      logger.info(
        `Found a index named ${this.getAliasName()}.  We need that name for our alias so we are deleting the index.`,
      )
      await this.elasticService
        .deleteIndex(this.getAliasName())
        .catch((err) => {
          logger.debug(
            `Unable to delete index named "${this.getAliasName()}".${err}.`,
          )
        })
    }

    interface Options extends IndicesUpdateAliases {
      body: {
        actions: RequestBody[]
      }
    }

    const updateOptions: Options = {
      body: {
        actions: [
          {
            add: {
              index: this.getWorkerIndexName(), //something like alias-dev20210219_121308620
              alias: this.getWorkerPrefix(), //alias-dev or alias-staging or alias-prod
            },
          },
          {
            remove: {
              index: this.getWorkerIndexName(),
              alias: this.getCollectorWorkingName(this.getEnvironment()), //alias-devCollectorWorking or alias-stagingCollectorWorking or ...
            },
          },
        ],
      },
    }

    await this.elasticService.updateIndexAliases(updateOptions)
    logger.debug(`Activation done!`)
  }
  async deleteIndices(indexNames: string[]) {
    return await this.elasticService.deleteIndices({ index: indexNames })
  }

  /**
   * Add aliases to a index.
   * Removes aliases from a index.
   * ... or both.
   *
   * @param {string} indexName
   * @param {string[]} aliasesToAdd - aliases to add to the index
   * @param {string[]} aliasesToRemove - aliases to remove from the index
   */
  async updateIndexAliases(
    indexName: string,
    aliasesToAdd: string[] | null,
    aliasesToRemove: string[] | null,
  ): Promise<boolean> {
    const toAdd = aliasesToAdd ? aliasesToAdd : []
    const toRemove = aliasesToRemove ? aliasesToRemove : []

    if (!indexName || (toAdd.length === 0 && toRemove.length === 0)) {
      logger.warn(`Nothing to do for updateIndexAliases`)
      return false
    }

    interface Options extends IndicesUpdateAliases {
      body: {
        actions: RequestBody[]
      }
    }
    const updateOptions: Options = {
      body: {
        actions: [],
      },
    }

    toRemove.forEach((aliasName) => {
      updateOptions.body.actions.push({
        remove: {
          index: indexName,
          alias: aliasName,
        },
      })
    })
    toAdd.forEach((aliasName) => {
      updateOptions.body.actions.push({
        add: {
          index: indexName,
          alias: aliasName,
        },
      })
    })

    try {
      await this.elasticService.updateIndexAliases(updateOptions)
      return true
    } catch (err) {
      logger.debug(`updateIndexAliases failed`, err)
      return false
    }
  }
  /*
    todo: remove when mocks are not needed.
  */
  async createMockHelperAddServices(
    sourceIndex: string,
    destEnvironment: Environment,
  ) {
    logger.info(`- Create mock services for ${destEnvironment} started - `)

    const services = await this.elasticService.fetchServices(
      this.getAliasName(),
      null,
      1000,
    )
    logger.info(`Mocking ${services.length} services`)

    let instance: string
    switch (destEnvironment) {
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

    const destIndex = this.getPrefix(destEnvironment)

    logger.debug(`Mocking is deleting index ${destIndex}`)
    try {
      await this.elasticService.deleteIndex(destIndex)
    } catch (err) {
      logger.debug('No need to delete, index was not found')
    }
    logger.debug(
      `copying all services from index "${sourceIndex}" to index "${destIndex}"`,
    )

    //Modifying the dest service a little to see difference.
    services.forEach((e: Service, index) => {
      const dest: Service = Object.assign(e)
      dest.title += `-${destEnvironment}`

      if (dest?.environments?.length && dest.environments[0].details?.length) {
        dest.environments[0].details[0].xroadIdentifier.instance = instance
        dest.environments[0].environment = destEnvironment

        if (dest.environments[0].details[0].openApiString?.length) {
          const apiObject: OpenApi = JSON.parse(
            dest.environments[0].details[0].openApiString,
          )
          apiObject.info.title += ` - ${destEnvironment}`
          dest.environments[0].details[0].openApiString = JSON.stringify(
            apiObject,
          )
        }
      }

      services[index] = dest
      JSON.stringify(services, null, 5)
    })

    logger.debug(
      `Bulk inserting ${services.length} services into "${destIndex}" index with forceRefresh = true`,
    )

    await this.elasticService.bulk(services, destIndex, true)

    logger.info(`- Create mock services for ${destEnvironment} ended  - `)
  }

  /*
    todo: remove when mocks are not needed.
  */
  async createMocksHelperDeleteByIds(
    deleteEnvironment: Environment,
    deleteIds: string[],
  ) {
    const deleteIndexName = this.getPrefix(deleteEnvironment)
    logger.debug(
      `Removing ${deleteIds.length} services from ${deleteEnvironment} :${deleteIds}`,
    )
    await this.elasticService.deleteByIds(deleteIds, deleteIndexName)
  }
  /**
   * Copies values from source index to other environment indexes
   * and modifies the copied data a little.
   * //todo:  remove when mocks are not needed
   * @param {string} sourceIndex
   * @param {Environment[]} destEnvironments
   * @memberof ElasticService
   */
  async createMocks(
    sourceIndex: string,
    destEnvironments: Environment[],
    deleteServicesToTestMergeLogic: boolean,
  ) {
    logger.debug(
      '  ---------------------- Creating mocks started  ---------------------- ',
    )

    //Copying values from source index and inserting
    // modified data into destination indices
    for (let i = 0; i < destEnvironments.length; i++) {
      const environment = destEnvironments[i]

      await this.createMockHelperAddServices(sourceIndex, environment)
    }

    logger.debug(`Done cloning environments: "${destEnvironments}"`)
    logger.info(`Adding fake CollectorWorking for staging and dev`)
    // add fake alias to to fool isCollectorRunning
    await this.updateIndexAliases(
      this.getWorkerIndexName(),
      [
        this.getCollectorWorkingName(Environment.STAGING),
        this.getCollectorWorkingName(Environment.PROD),
      ],
      null,
    )

    //A function which creates a trigger to delete alias
    const deleteAliasAfter = (
      els: CollectionService,
      indexName: string,
      aliasName: string,
      delay: number,
    ) => {
      logger.debug(
        `Adding Timer, triggered at "${new Date(
          Date.now() + delay,
        ).toISOString()}" for the removal of alias ${aliasName} from index ${indexName}.`,
      )

      return new Promise(function (resolve) {
        setTimeout(async () => {
          logger.debug('removing worker alias ' + aliasName)
          const success = await els.updateIndexAliases(indexName, null, [
            aliasName,
          ])
          logger.debug(
            success
              ? `successfully removed "${aliasName}"`
              : `failed removing "${aliasName}"`,
          )
          resolve
        }, delay)
      })
    }

    logger.debug('-- Setting upp fake workers on different environments -- ')
    //delete staging working alias from worker index after 5 seconds
    deleteAliasAfter(
      this,
      this.getWorkerIndexName(),
      this.getCollectorWorkingName(Environment.STAGING),
      5 * 1000,
    )

    //delete prod working alias from worker index after 20 seconds
    deleteAliasAfter(
      this,
      this.getWorkerIndexName(),
      this.getCollectorWorkingName(Environment.PROD),
      20 * 1000,
    )

    logger.info('  -  Ids existing after mocking  -')
    for (let i = 0; i < destEnvironments.length; i++) {
      const environment = destEnvironments[i]
      const index =
        environment === Environment.DEV
          ? this.getWorkerIndexName()
          : this.getPrefix(environment)
      const ids = await this.elasticService.fetchAllIds(index)
      logger.debug(`The ${ids.length} ids from ${index}`)
      logger.info(`are: ${ids}`)
    }

    if (deleteServicesToTestMergeLogic) {
      logger.info(
        ` Removing services from different environments to test merging logic.
      Delete logic is:
             Removing services on environments marked with 0
        
      dev
     / staging
    | / prod
    || /
    dsp
    000 SVMtREVWX0dPVl8xMDAwMV9UZXN0U2VydmljZV9URVNU
    001 SVMtREVWX0dPVl8xMDAwNV9Mb2dyZWdsYW4tUHJvdGVjdGVkX1JhZnJhZW50T2t1c2tpcnRlaW5p
    010 SVMtREVWX0dPVl8xMDAxMV9VVEwtUHJvdGVjdGVkX0RWQUxBUkxFWUZJLVYx
    011 SVMtREVWX0dPVl8xMDAxM19WaW5udWVmdGlybGl0aWQtUHJvdGVjdGVkX3NseXNhc2tyYW5pbmc
    100 SVMtREVWX0dPVl8xMDAwMF9pc2xhbmQtaXMtcHJvdGVjdGVkX3Roam9kc2tyYS12U2FldmFybWE
    101 SVMtREVWX0dPVl8xMDAwM19WTVNULVBhcmVudGFsTGVhdmUtUHJvdGVjdGVkX1BhcmVudGFsTGVhdmVBcHBsaWNhdGlvbg
    110 SVMtREVWX0dPVl8xMDAwN19TSlVLUkEtUHJvdGVjdGVkX2Rldi5zaXJlc3R3cy5zanVrcmEuaXM
    111 others should exist on all environments
    
    `,
      )

      this.createMocksHelperDeleteByIds(Environment.DEV, [
        'SVMtREVWX0dPVl8xMDAwMV9UZXN0U2VydmljZV9URVNU',
        'SVMtREVWX0dPVl8xMDAwNV9Mb2dyZWdsYW4tUHJvdGVjdGVkX1JhZnJhZW50T2t1c2tpcnRlaW5p',
        'SVMtREVWX0dPVl8xMDAxMV9VVEwtUHJvdGVjdGVkX0RWQUxBUkxFWUZJLVYx',
        'SVMtREVWX0dPVl8xMDAxM19WaW5udWVmdGlybGl0aWQtUHJvdGVjdGVkX3NseXNhc2tyYW5pbmc',
      ])
      this.createMocksHelperDeleteByIds(Environment.STAGING, [
        'SVMtREVWX0dPVl8xMDAwMV9UZXN0U2VydmljZV9URVNU',
        'SVMtREVWX0dPVl8xMDAwNV9Mb2dyZWdsYW4tUHJvdGVjdGVkX1JhZnJhZW50T2t1c2tpcnRlaW5p',
        'SVMtREVWX0dPVl8xMDAwMF9pc2xhbmQtaXMtcHJvdGVjdGVkX3Roam9kc2tyYS12U2FldmFybWE',
        'SVMtREVWX0dPVl8xMDAwM19WTVNULVBhcmVudGFsTGVhdmUtUHJvdGVjdGVkX1BhcmVudGFsTGVhdmVBcHBsaWNhdGlvbg',
      ])
      this.createMocksHelperDeleteByIds(Environment.PROD, [
        'SVMtREVWX0dPVl8xMDAwMV9UZXN0U2VydmljZV9URVNU',
        'SVMtREVWX0dPVl8xMDAxMV9VVEwtUHJvdGVjdGVkX0RWQUxBUkxFWUZJLVYx',
        'SVMtREVWX0dPVl8xMDAwMF9pc2xhbmQtaXMtcHJvdGVjdGVkX3Roam9kc2tyYS12U2FldmFybWE',
        'SVMtREVWX0dPVl8xMDAwN19TSlVLUkEtUHJvdGVjdGVkX2Rldi5zaXJlc3R3cy5zanVrcmEuaXM',
      ])
    }

    logger.debug(
      '  ---------------------- Creating mocks finished ---------------------- ',
    )
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
  async isCollectorRunning(environment: Environment): Promise<boolean> {
    // todo: check if alias this.getCollectorWorkingName(environment) exists on given environment
    const aliasName = this.getCollectorWorkingName(environment)
    const indices = await this.elasticService.fetchIndexNamesFromAlias(
      aliasName,
    ) //todo: this should be done from remote cluster

    let value = false
    if (indices && indices.length) {
      value = true
    }

    logger.debug(
      `Waiting for alias "${aliasName}" connected to indices. Collector is ${
        value ? '' : 'not '
      }running`,
      indices,
    )
    return value
  }

  /**
   * Waits until a collector finishes running in one of the given environments.
   *
   * @param {Environment[]} environments
   * @param {Date} stopWaiting                  - When to cancel waiting for other environments.
   * @param {number} [checkInterval=(2 * 1000)] - How long between checks in milliseconds. Default set to 2 seconds.
   * @returns {(Promise<Environment | null>)}   - Returns Environment if collector is not running in that environment.
                                                - null: If collector is still running in all given environments and max wait time is reached.
   */
  private async waitForCollectorToFinishOnOtherCluster(
    environments: Environment[],
    stopWaiting: Date,
    checkInterval: number = 2 * 1000,
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

    logger.info(
      `Waiting for collectors on other environments to finish. Will stop waiting at "${stopWaiting.toISOString()}"`,
    )

    while (now < stopWaiting.getTime()) {
      for (let i = 0; i < environments.length; i++) {
        if (!(await this.isCollectorRunning(environments[i]))) {
          return environments[i]
        }
      }
      await pause(checkInterval)
      now = Date.now()
    }

    logger.warn(
      'Waiting for collector to finish on other environments took to long, now we will stop waiting and finish up.',
    )
    return null
  }

  copyRemoteIndexToLocalIndex(
    remoteEnvironment: Environment,
    remoteIndexName: string,
    localIndexName: string,
  ) {
    logger.warn(
      `This function should copy services from ` +
        `alias named "${remoteIndexName}" ` +
        `located on cluster, running the ${remoteEnvironment} environment.`,
    )
    logger.warn(
      `The services should be copied to ` +
        `a local index called "${localIndexName}".`,
    )
  }

  /**
   * Copies values from a environment located on a different cluster
   *
   * @private
   * @param {Environment} environment
   */
  private async copyRemoteValues(environment: Environment) {
    //todo: copy values from other environment cluster
    this.copyRemoteIndexToLocalIndex(
      environment,
      this.getAliasName(),
      this.getPrefix(environment),
    )

    const externalIndex = this.getPrefix(environment)
    logger.info(`Copying values from index ${externalIndex}`)
    const externalIds = await this.elasticService.fetchAllIds(externalIndex)

    if (!externalIds || !externalIds.length) {
      return //nothing to do
    }

    // get id of all services in current environment
    const localIds = await this.elasticService.fetchAllIds(
      this.getWorkerIndexName(),
    )
    //Find services that will need to be merged from external to current environment
    const commonIds = externalIds.filter((id) => localIds.includes(id))

    //find services that will need to be created in current environment
    const externalUnique = externalIds.filter((id) => !localIds.includes(id))

    logger.debug(`localIds   : ${localIds}`)
    logger.debug(`externalIds   : ${externalIds}`)
    logger.debug(`commonIds   : ${commonIds}`)
    logger.debug(`externalUnique   : ${externalUnique}`)

    // fetching services not existing in current environment
    const allUniqueExternalServices = await this.elasticService.fetchServices(
      externalIndex,
      externalUnique,
    )

    logger.debug(
      `Removing services that are not collected locally by remote collector`,
    )

    // Locally collected services are usually stored in the first item in the
    // environments array. If collector does not have a local service but it
    // exists in the remote environment that external service will be stored in
    // the first item of the array.  We will need to remove those services,
    // because later in the process of this running instance, we will collect
    // them our selves to ensure that we are as much up to date as possible.
    const uniqueExternalServices = allUniqueExternalServices.filter(
      (e) => environment === e.environments[0].environment,
    )

    logger.debug(
      `Adding to worker index, ${uniqueExternalServices.length} services that only exist in external index.`,
    )
    logger.debug(
      `Removed, ${
        allUniqueExternalServices.length - uniqueExternalServices.length
      } services that were not locally collected by the remote collector.`,
    )

    // Adding to current environment services that do not exist in it
    //todo: Maybe this should be done in chunks, not sure how intelligent the elasticsearch client is.
    this.bulkWorker(uniqueExternalServices, false)

    //Get services that exist in both environments
    const localServices = await this.elasticService.fetchServices(
      this.getWorkerIndexName(),
      commonIds,
    )

    const externalServices = await this.elasticService.fetchServices(
      externalIndex,
      commonIds,
    )

    //Merging external services into each localService object
    const mergedServices: Service[] = []
    localServices.forEach((source) =>
      mergedServices.push(
        this.mergeServices(
          source,
          externalServices[
            externalServices.findIndex((item) => item.id === source.id)
          ],
        ),
      ),
    )

    //Replacing the local local service objects with the merged ones.
    //todo: Maybe this should be done in chunks, not sure how intelligent the elasticsearch client is.
    this.bulkWorker(mergedServices, false)

    logger.info(`Copying values from environment ${environment} finished`)
  }
  /**
   * Merges two service objects into a new one
   *
   * @param {Service} source
   * @param {Service} mergeIntoSource
   * @returns {Service}
   */
  mergeServices(source: Service, mergeIntoSource: Service): Service {
    const merged: Service = Object.assign(source)

    //Each environment should add it's environment to the first array.
    merged.environments.push(mergeIntoSource.environments[0])
    merged.access = union(source.access, mergeIntoSource.access)
    merged.data = union(source.data, mergeIntoSource.data)
    merged.pricing = union(source.pricing, mergeIntoSource.pricing)
    merged.type = union(source.type, mergeIntoSource.type)
    return merged
  }

  /**
   *  Copies values from other environments into worker index
   *
   *  @param {number} [waitMax=(120 * 1000)] - How long to wait until we give up in milliseconds. Default set to 120 seconds.
   */
  async copyValuesFromOtherEnvironments(waitMax: number = 120 * 1000) {
    //TODO: remove createMocks when you are able to copy from other clusters
    await this.createMocks(
      this.getWorkerIndexName(),
      [Environment.STAGING, Environment.PROD],
      false,
    )

    logger.info(
      `Copying values from other environments to`,
      this.getEnvironment(),
    )

    const otherEnvironments = this.getOtherEnvironments()

    logger.info(`Environments to copy from: "${otherEnvironments}"`)

    const endWait = new Date(Date.now() + waitMax)

    let environment = await this.waitForCollectorToFinishOnOtherCluster(
      otherEnvironments,
      endWait,
    )
    while (environment) {
      logger.debug(
        `processing "${environment}", environments:"${otherEnvironments}"`,
      )
      await this.copyRemoteValues(environment)

      otherEnvironments.splice(otherEnvironments.indexOf(environment), 1)

      environment = await this.waitForCollectorToFinishOnOtherCluster(
        otherEnvironments,
        endWait,
      )
    }

    logger.info(`Copying values from other environments finished`)
  }

  /**
   * Scoop up all, (if any) old indices which might have been created
   *  by older failed task executions.
   *
   * The function deletes all indices with names, that start with
   * current alias name + current environment name
   * and do NOT belong to the associated alias.
   *
   *
   * See: getWorkerPrefix() for more info on naming convention.
   *
   */
  async deleteDanglingIndices() {
    logger.debug('Delete dangling indices started')
    const indices = await this.elasticService.fetchAllIndexNames()
    if (indices) {
      const activeIndices = await this.elasticService.fetchIndexNamesFromAlias(
        this.getWorkerPrefix(),
      )
      logger.debug('activeIndices', activeIndices)

      // Get all indices associated with us in this environment
      // except those, being used in current environment alias.
      const workers = indices.filter(
        (e) =>
          e.startsWith(`${this.getWorkerPrefix()}`) &&
          !activeIndices?.includes(e),
      )
      if (workers.length) {
        logger.debug(`deleting indices:  ${JSON.stringify(workers, null, 4)}`)
        try {
          await this.deleteIndices(workers)
        } catch (err) {
          logger.warn(
            'Canceling deletion of dangling indices ' +
              'because deleting indices failed with the error: ',
            err,
          )
          return
        }
      } else {
        logger.debug(`No dangling indices to delete.`)
      }
    }
    logger.debug('Delete dangling indices finished')
  }
}
