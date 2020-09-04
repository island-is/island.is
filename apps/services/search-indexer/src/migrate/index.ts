import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import * as util from 'util'
import fetch from 'node-fetch'
import { DomainPackageDetails, PackageDetails } from 'aws-sdk/clients/es'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import { logger } from '@island.is/logging'
import { environment, Environment } from '../environments/environment'
import { checkAWSAccess, awsEs } from './aws'
import * as elastic from './elastic'

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
  private readonly config: Environment['migrate']
  private readonly lang: string = 'is'

  constructor(config: Environment['migrate']) {
    this.config = config
  }

  // TODO: Make this work without AWS as well
  async run() {
    logger.info('Starting migration if needed', this.config)
    if (!this.config.isRunningLocally) {
      await checkAWSAccess()
    }
    await elastic.ping()
    await this.migrateIfNeeded()
  }

  private async migrateIfNeeded() {
    const codeVersion = elastic.getCodeVersion()
    const hasVersion = await elastic.esHasVersion(codeVersion)
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
    const wantedIndexName = elastic.getIndexNameForVersion(codeVersion)
    const oldIndexName = elastic.getIndexNameForVersion(codeVersion - 1)
    logger.info('Switching index alias', { oldIndexName, wantedIndexName })
    return elastic.switchAlias(oldIndexName, wantedIndexName)
  }

  private async aliasIsCorrect(codeVersion: number): Promise<boolean> {
    const alias = await elastic.getMainAlias()
    const wantedIndexName = elastic.getIndexNameForVersion(codeVersion)
    logger.info('Validating alias name', {
      alias: alias,
      wanted: wantedIndexName,
    })
    return alias === wantedIndexName
  }

  // HERE <-
  private async migrate(codeVersion: number) {
    const dictionaryVersion = await this.getDictionaryVersion()
    const packageIds: PackageIds = await this.getAllPackageIdsForVersion(
      dictionaryVersion,
    )
    logger.info('Migrate Found Package IDS', {
      dictVersion: dictionaryVersion,
      packageIds: packageIds,
    })
    const newPackageIds = await this.createPackagesIfNeeded(dictionaryVersion, packageIds)
    await this.associatePackagesIfNeeded(newPackageIds)
    return this.doMigrate(codeVersion, newPackageIds)
  }

  private async doMigrate(codeVersion: number, packageIds) {
    const config = this.createConfig(packageIds)
    logger.info('Updating index template', { codeVersion, packageIds, config })
    return elastic.createTemplate(config).then(() =>
      elastic.reindexToNewIndex(codeVersion),
    )
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
    return awsEs
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
    const response = await awsEs.dissociatePackage(params).promise()
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
    return awsEs
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
    return awsEs
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
    const response = await awsEs.associatePackage(params).promise()
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
    return awsEs
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
}

async function migrateBootstrap() {
  console.log(environment.migrate.elasticNode)
  if (environment.migrate.elasticNode === '') {
    logger.error('Config not valid', environment.migrate)
    return
  }

  const app = new App(environment.migrate)
  await app.run()
}

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error
  throw error
})
