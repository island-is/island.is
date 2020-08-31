import * as AWS from 'aws-sdk'
import { Client } from '@elastic/elasticsearch'
import * as fs from 'fs'
import * as util from 'util'
import fetch from 'node-fetch'
import { DomainPackageDetails, PackageDetails } from 'aws-sdk/clients/es'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import { logger } from '@island.is/logging'
import { ElasticService } from '@island.is/api/content-search'
import { map } from 'lodash'

class Config {
  elasticNode: string
  indexMain: string
  esDomain: string
  codeTemplateFile: string
  dictRepo: string
  s3Bucket: string
  s3Folder: string
  awsRegion: string
  packagePrefix: string

  static createFromEnv(env) {
    const ret: Config = new Config()
    ret.elasticNode = env['ELASTIC_NODE'] || ''
    ret.indexMain = env['ES_INDEX_MAIN'] || 'island-is'
    ret.esDomain = env['ES_DOMAIN'] || 'search'
    ret.codeTemplateFile =
      env['CODE_TEMPLATE'] || '/webapp/config/template-is.json'
    ret.dictRepo =
      env['GITHUB_DICT_REPO'] ||
      'https://api.github.com/repos/island-is/elasticsearch-dictionaries'
    ret.s3Bucket = env['S3_BUCKET'] || 'prod-es-custom-packages'
    ret.s3Folder = env['S3_FOLDER'] || ''
    ret.awsRegion = env['AWS_REGION'] || 'eu-west-1'
    ret.packagePrefix = env['ES_PACKAGE_PREFIX'] || ''
    if (ret.packagePrefix.slice(-1) === '-') {
      ret.packagePrefix = ret.packagePrefix.slice(0, -1)
    }
    return ret
  }

  isValid(): boolean {
    return this.elasticNode !== ''
  }
}

class EsPackage {
  packageId: string
  dictLang: string
  dictType: string
  dictVersion: string
  packageName: string
  packagePrefix = ''

  static create(o): EsPackage {
    const ret = new EsPackage()
    ret.packageId = o.PackageID
    ret.packageName = o.PackageName
    const parts = ret.packageName.split('-')
    if (parts.length < 3) {
      return null
    }
    if (parts.length > 3) {
      ret.packagePrefix = parts.shift()
    }
    ret.dictLang = parts[0]
    ret.dictType = parts[1]
    ret.dictVersion = parts[2]
    return ret
  }
}

class PackageIds extends Map<string, EsPackage> {}

class PackageStatuses extends Map<string, boolean> {}

class App {
  private readonly config: Config
  private readonly awsEs: AWS.ES
  private esClient: Client
  private readonly lang: string = 'is'
  private readonly templateName: string = 'template-is'

  constructor(config: Config) {
    this.config = config
    AWS.config.update({ region: config.awsRegion })
    this.awsEs = new AWS.ES()
  }

  run() {
    logger.info('Starting migration if needed', this.config)
    this.checkAccess()
      .then(() => this.checkESAccess())
      .then(() => this.migrateIfNeeded())
      .catch((error) => {
        throw error
      })
  }

  private async checkESAccess() {
    const client = await this.getEsClient()
    const result = await client.ping()
    logger.info('Got elasticsearch ping response', {
      r: result,
    })
  }

  private async checkAccess() {
    return this.awsEs
      .listDomainNames()
      .promise()
      .then((domains: AWS.ES.Types.ListDomainNamesResponse) => {
        let domainFound = false
        logger.info('Valdating esDomain agains aws domain list', domains)
        domains.DomainNames.forEach((domain) => {
          if (domain.DomainName === this.config.esDomain) {
            domainFound = true
          }
        })

        if (!domainFound) {
          throw new Error('Domain not found')
        }
      })
  }

  private async migrateIfNeeded() {
    const codeVersion = this.getCodeVersion()
    const hasVersion = await this.esHasVersion(codeVersion)
    if (hasVersion) {
      logger.info('Found this code version in elasticsearch', {
        version: codeVersion,
      })
      if (!(await this.aliasIsCorrect(codeVersion))) {
        logger.info('Alias is not correct')
        await this.fixAlias(codeVersion)
        logger.info('Alias was fixed')
        return
      }
      logger.info('Version already in elasticsearch no need to migrate')
      return
    }

    return this.migrate(codeVersion)
  }

  private async fixAlias(codeVersion: number) {
    const wantedIndexName = App.getIndexNameForVersion(codeVersion)
    const oldIndexName = App.getIndexNameForVersion(codeVersion - 1)
    logger.info('Switching index alias', { oldIndexName, wantedIndexName })
    return this.switchAlias(oldIndexName, wantedIndexName)
  }

  private async aliasIsCorrect(codeVersion: number): Promise<boolean> {
    const alias = await this.getMainAlias()
    const wantedIndexName = App.getIndexNameForVersion(codeVersion)
    logger.info('Validating alias name', {
      alias: alias,
      wanted: wantedIndexName,
    })
    return alias === wantedIndexName
  }

  private async getMainAlias(): Promise<string | null> {
    logger.info('Getting main alias')
    const client = await this.getEsClient()
    return client.indices
      .getAlias({ name: this.config.indexMain })
      .then((response) => {
        const body = response.body
        for (const index in body) {
          const aliases = body[index]['aliases']
          if (aliases[this.config.indexMain] ?? null) {
            return index
          }
        }
        return null
      })
  }

  private async migrate(codeVersion: number) {
    const dictionaryVersion = await this.getDictionaryVersion()
    const packageIds: PackageIds = await this.getAllPackageIdsForVersion(
      dictionaryVersion,
    )
    logger.info('Migrate Found Package IDS', {
      dictVersion: dictionaryVersion,
      packageIds: packageIds,
    })
    return this.createPackagesIfNeeded(dictionaryVersion, packageIds)
      .then((newPackageIds) => this.associatePackagesIfNeeded(newPackageIds))
      .then((newPackageIds) => this.doMigrate(codeVersion, newPackageIds))
  }

  private async doMigrate(codeVersion: number, packageIds) {
    const config = this.createConfig(packageIds)
    logger.info('Updating index template', {codeVersion, packageIds, config})
    return this.createTemplate(config).then(() =>
      this.reindexToNewIndex(codeVersion),
    )
  }

  private async reindexToNewIndex(codeVersion: number) {
    logger.info('Reindexing to new index code version is', { codeVersion })
    const oldIndex = await this.esGetOlderVersionIndex(codeVersion)
    if (!oldIndex) {
      logger.info('No older version found creating new index for this version')
      return this.createIndex(codeVersion)
    }

    const newIndex = App.getIndexNameForVersion(codeVersion)
    const params = {
      waitForCompletion: true,
      body: {
        source: {
          index: oldIndex,
        },
        dest: {
          index: newIndex,
        },
      },
    }
    logger.info('Reindex to new index', params)
    const client = await this.getEsClient()
    const response = await client.reindex(params)
    logger.info('Reindex returned', response)
    return this.switchAlias(oldIndex, newIndex)
  }

  private async switchAlias(oldIndex: string | null, newIndex: string) {
    const actions = []
    if (oldIndex) {
      actions.push({
        remove: {
          index: oldIndex,
          alias: this.config.indexMain,
        },
      })
    }
    actions.push({
      add: {
        index: newIndex,
        alias: this.config.indexMain,
      },
    })
    const params = {
      body: {
        actions: actions,
      },
    }
    logger.info('Switch Alias', params)

    const client = await this.getEsClient()
    return client.indices.updateAliases(params)
  }

  private async createIndex(codeVersion) {
    const name = App.getIndexNameForVersion(codeVersion)
    const params = {
      index: name,
    }
    logger.info('Create Index', params)
    const client = await this.getEsClient()
    return client.indices
      .create(params)
      .then(() => this.switchAlias(null, name))
  }

  private async createTemplate(config: string) {
    const templateName = this.templateName
    logger.info('Create template', templateName)
    const client = await this.getEsClient()
    return client.indices.putTemplate({
      name: templateName,
      body: config,
    }).catch((error) => {
      logger.error('Failed to update template', {error, config, templateName})
      throw error
    })
  }

  private createConfig(packageIds: PackageIds): string {
    logger.info('Creating config file')
    let config = fs.readFileSync(this.config.codeTemplateFile).toString()
    for (const esPackage of packageIds.values()) {
      const key = '{' + esPackage.dictType.toUpperCase() + '}'
      config = config.replace(key, esPackage.packageId)
    }
    logger.info('Done creating config')
    return config
  }

  private async associatePackagesIfNeeded(packageIds: PackageIds) {
    const domainPackages = await this.getDomainPackages()
    logger.info('Found domain packages', {
      d: domainPackages,
      p: packageIds.keys(),
    })
    for (const type of packageIds.keys()) {
      const esPackage = packageIds.get(type)
      const id = esPackage.packageId
      const tmp = domainPackages.get(id)
      logger.info('Check if Package domain is available', {
        id: id,
        isAvailable: tmp,
        type: type,
      })
      if (tmp === false) {
        await this.dissociatePackage(esPackage)
        return this.associatePackagesIfNeeded(packageIds)
      }

      if (!tmp) {
        await this.associatePackage(esPackage)
      }
    }
    return packageIds
  }

  private async getDomainPackages(): Promise<PackageStatuses> {
    logger.debug('GetDomainPackages')
    return this.awsEs
      .listPackagesForDomain({
        DomainName: this.config.esDomain,
      })
      .promise()
      .then((list) => {
        const ret: PackageStatuses = new PackageStatuses()
        logger.debug('Domain listing', list.DomainPackageDetailsList)
        for (const element of list.DomainPackageDetailsList) {
          ret.set(element.PackageID, element.DomainPackageStatus === 'ACTIVE')
        }
        return ret
      })
  }

  private async createPackagesIfNeeded(
    dictionaryVersion: string,
    packageIds: PackageIds,
  ): Promise<PackageIds> {
    const neededTypes = ['stemmer', 'keywords', 'stopwords', 'synonyms']
    for (const type of neededTypes) {
      if (!packageIds.has(type)) {
        const p = await this.migrateDictionary(dictionaryVersion, type)
        if (!p) {
          throw new Error('Could not create dictionary file for ' + type)
        }
        packageIds[type] = p
      }
    }
    logger.debug('CreatePIfNeeded', { ret: packageIds })
    return packageIds
  }

  private async migrateDictionary(
    version: string,
    type: string,
  ): Promise<EsPackage> {
    return this.pushToS3(type).then(() => this.createPackage(version, type))
  }

  private async dissociatePackage(esPackage: EsPackage): Promise<EsPackage> {
    const params = {
      DomainName: this.config.esDomain,
      PackageID: esPackage.packageId,
    }
    logger.info('DisAssociate Package', params)
    const response = await this.awsEs.dissociatePackage(params).promise()
    await this.waitForPackageStatus(
      response.DomainPackageDetails,
      null,
      'DISSOCIATING',
      5,
      () => {
        return this.getDomainPackage(esPackage.packageId)
      },
    )

    logger.info('Associate Package DONE', params)
    return esPackage
  }

  private async getDomainPackage(
    packageId: string,
  ): Promise<DomainPackageDetails> {
    return this.awsEs
      .listPackagesForDomain({
        DomainName: this.config.esDomain,
      })
      .promise()
      .then((list) => {
        for (const element of list.DomainPackageDetailsList) {
          if (element.PackageID === packageId) {
            return element
          }
        }
      })
  }

  private async getPackage(packageId: string): Promise<PackageDetails> {
    const params = {
      Filters: [
        {
          Name: 'PackageID',
          Value: [packageId],
        },
      ],
    }
    return this.awsEs
      .describePackages(params)
      .promise()
      .then((res) => {
        return res.PackageDetailsList[0] ?? null
      })
  }

  private async associatePackage(esPackage: EsPackage): Promise<EsPackage> {
    const params = {
      DomainName: this.config.esDomain,
      PackageID: esPackage.packageId,
    }
    logger.info('Associate Package', params)
    const response = await this.awsEs.associatePackage(params).promise()
    await this.waitForPackageStatus(
      response.DomainPackageDetails,
      'ACTIVE',
      'ASSOCIATING',
      5,
      () => {
        return this.getDomainPackage(esPackage.packageId)
      },
    )

    logger.info('Associate Package DONE', params)

    return esPackage
  }

  private createS3Key(type: string): string {
    return this.config.s3Folder + this.lang + '/' + type + '.txt'
  }

  private async createPackage(
    version: string,
    type: string,
  ): Promise<EsPackage> {
    const packageName = this.getDictFileName(type, version)
    const packageType = 'TXT-DICTIONARY'
    const key = this.createS3Key(type)

    const params = {
      PackageName: packageName,
      PackageType: packageType,
      PackageSource: {
        S3BucketName: this.config.s3Bucket,
        S3Key: key,
      },
    }
    logger.info('Create Package', params)
    return this.awsEs
      .createPackage(params)
      .promise()
      .then((packageResponse: AWS.ES.CreatePackageResponse) =>
        this.waitForPackageStatus(
          packageResponse.PackageDetails,
          'AVAILABLE',
          'COPYING',
          3,
          (packageId: string) => {
            return this.getPackage(packageId)
          },
        ),
      )
      .then((packageResponse) => {
        return EsPackage.create(packageResponse)
      })
  }

  private static findStatus(response) {
    if ((response as DomainPackageDetails).DomainPackageStatus !== undefined) {
      return response.DomainPackageStatus
    }
    if ((response as PackageDetails).PackageStatus !== undefined) {
      return response.PackageStatus
    }
    return null
  }

  private async waitForPackageStatus(
    response,
    expectedStatus: string,
    waitingStatus: string,
    sleepSec: number,
    responseCallback,
  ) {
    const inboundStatus = App.findStatus(response)
    logger.debug('WaitForPackageStatus', {
      response: response,
      inboundStatus: inboundStatus,
      expectedStatus: expectedStatus,
      waitingStatus: waitingStatus,
      sleep: sleepSec,
    })

    if (expectedStatus === null && inboundStatus === null) {
      return response
    }

    if (inboundStatus === expectedStatus) {
      return response
    }

    if (inboundStatus !== waitingStatus) {
      throw new Error('Failed ' + waitingStatus)
    }

    await this.sleep(sleepSec)

    logger.debug('Calling response callback')
    const res = await responseCallback(response.PackageID)
    return await this.waitForPackageStatus(
      res,
      expectedStatus,
      waitingStatus,
      sleepSec,
      responseCallback,
    )
  }

  private async sleep(sec: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, sec * 1000)
    })
  }

  private async pushToS3(type: string): Promise<ManagedUpload.SendData> {
    const s3 = new AWS.S3()
    const url = this.getDictUrl(type)
    const key = this.createS3Key(type)
    logger.info('Push To S3', {
      key: key,
      url: url,
      bucket: this.config.s3Bucket,
    })
    const response = await fetch(url)
    logger.debug('Start s3 upload', { url: url, r: response })
    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: this.config.s3Bucket,
          Key: key,
          Body: response.body,
        },
        (err, data) => {
          if (err) {
            logger.error('S3 upload failure', err)
            return reject(err)
          }
          return resolve(data)
        },
      )
    })
  }

  private async getAllPackageIdsForVersion(
    version: string,
  ): Promise<PackageIds> {
    return this.awsEs
      .describePackages()
      .promise()
      .then((list) => {
        const ret: PackageIds = new PackageIds()
        list.PackageDetailsList.forEach((element) => {
          const t = EsPackage.create(element)
          logger.debug('Should add Version package?', {
            t: t,
            v: version,
            p: this.config.packagePrefix,
          })
          if (
            t &&
            t.dictVersion === version &&
            t.packagePrefix === this.config.packagePrefix
          ) {
            ret.set(t.dictType, t)
          }
        })
        return ret
      })
  }

  private getDictFileName(name: string, version: string) {
    let prefix = this.config.packagePrefix
    if (prefix) {
      prefix += '-'
    }
    return util.format('%s%s-%s-%s', prefix, this.lang, name, version)
  }

  private getDictUrl(type: string) {
    const url = this.config.dictRepo
      .replace('api.github', 'github')
      .replace('/repos/', '/')
    return util.format(
      '%s/blob/master/%s/%s.txt?raw=true',
      url,
      this.lang,
      type,
    )
  }

  private async getDictionaryVersion() {
    const url = this.config.dictRepo + '/releases/latest'
    return fetch(url)
      .then((raw) => {
        return raw.json()
      })
      .then((data) => {
        return data.tag_name
      })
  }

  private getCodeVersion() {
    const raw = fs.readFileSync(this.config.codeTemplateFile)
    const json = JSON.parse(raw.toString())
    return json.version
  }

  private async esHasVersion(version: number) {
    const indexName = App.getIndexNameForVersion(version)
    const client = await this.getEsClient()
    const result = await client.indices.exists({
      index: indexName,
    })
    logger.info('Checking if index exists', {
      index: indexName,
      result: result.body,
    })
    return result.body
  }

  public async esGetOlderVersionIndex(
    currentVersion: number,
  ): Promise<string | null> {
    logger.info('Trying to find older indexes')
    const client = await this.getEsClient()

    for (var i = currentVersion - 1; i > 0; i--) {
      const indexExists = await this.esHasVersion(i)
      if (indexExists) {
        // this old version exists, return the name of the index
        return App.getIndexNameForVersion(i)
      }
    }

    logger.info('No older indice found')
    // no index found
    return null
  }

  private static getIndexNameForVersion(version: number) {
    return util.format('island-is-v%d', version)
  }

  private async getEsClient(): Promise<Client> {
    if (this.esClient) {
      return this.esClient
    }
    this.esClient = await new ElasticService().getClient()
    return this.esClient
  }
}

async function migrateBootstrap() {
  const config = Config.createFromEnv(process.env)
  if (!config.isValid()) {
    logger.error('Config not valid', config)
    return
  }

  const app = new App(config)
  app.run()
}

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // allow critical errors in migration to take down the process
  throw error
})
