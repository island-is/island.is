/* eslint-disable */

const AWS = require('aws-sdk')
const ES = require('@elastic/elasticsearch')
const fetch = require('node-fetch')
const util = require('util')
const stream = require('stream')
const fs = require('fs')

class Config {
  elasticNode
  indexMain
  esDomain
  codeTemplateFile
  dictRepo
  s3Bucket
  s3Folder
  awsRegion

  static createFromEnv(env) {
    const ret = new Config()
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
    return ret
  }

  isValid() {
    return this.elasticNode !== ''
  }
}

class EsPackage {
  packageId
  dictLang
  dictType
  dictVersion
  packageName

  static create(o) {
    const ret = new EsPackage()
    ret.packageId = o.PackageID
    ret.packageName = o.PackageName
    const parts = ret.packageName.split('-')
    if (parts.length !== 3) {
      return null
    }
    ret.dictLang = parts[0]
    ret.dictType = parts[1]
    ret.dictVersion = parts[2]
    return ret
  }
}

class App {
  config
  awsEs
  esClient
  lang = 'is'
  templateName = 'template-is'

  constructor(config) {
    this.config = config
    AWS.config.update({ region: config.awsRegion })
    this.awsEs = new AWS.ES()
    this.esClient = new ES.Client({
      node: this.config.elasticNode,
    })
  }

  run() {
    console.info('App.run()', this.config)

    this.checkAccess().then(() => this.migrateIfNeeded())
  }

  async checkAccess() {
    return this.awsEs
      .listDomainNames()
      .promise()
      .then((domains) => {
        let domainFound = false
        console.debug('CheckAccess found domains', domains)
        for (let index in domains.DomainNames) {
          let domain = domains.DomainNames[index]
          if (domain.DomainName === this.config.esDomain) {
            domainFound = true
          }
        }
        if (!domainFound) {
          throw new Error('Domain not found')
        }
      })
  }

  async migrateIfNeeded() {
    const codeVersion = this.getCodeVersion()
    console.debug('Found Code Version', codeVersion)
    const hasVersion = await this.esHasVersion(codeVersion)
    if (hasVersion) {
      console.info('No need to migrate')
      return
    }

    return this.migrate(codeVersion)
  }

  async migrate(codeVersion) {
    const dictionaryVersion = await this.getDictionaryVersion()
    const packageIds = await this.getAllPackageIdsForVersion(dictionaryVersion)
    console.debug('Migrate Found Package IDS', packageIds)
    return this.createPackagesIfNeeded(dictionaryVersion, packageIds)
      .then((newPackageIds) => this.associatePackagesIfNeeded(newPackageIds))
      .then((newPackageIds) =>
        this.doMigrate(codeVersion, dictionaryVersion, newPackageIds),
      )
  }

  async doMigrate(codeVersion, dictVersion, packageIds) {
    const config = this.createConfig(dictVersion, packageIds)
    return this.createTemplate(config).then(() =>
      this.reindexToNewIndex(codeVersion),
    )
  }

  async reindexToNewIndex(codeVersion) {
    if (codeVersion === 1) {
      return this.createIndex(codeVersion)
    }

    const oldIndex = this.getIndexNameForVersion(codeVersion - 1)
    const newIndex = this.getIndexNameForVersion(codeVersion)
    const params = {
      wait_for_completion: true,
      body: {
        source: {
          index: oldIndex,
        },
        dest: {
          index: newIndex,
        },
      },
    }
    console.debug('Reindex to new index', params)
    return this.esClient
      .reindex(params)
      .then(() => this.switchAlias(oldIndex, newIndex))
  }

  async switchAlias(oldIndex, newIndex) {
    const actions = {}
    if (oldIndex) {
      actions['remove'] = {
        index: oldIndex,
        alias: this.config.indexMain,
      }
    }
    actions['add'] = {
      index: newIndex,
      alias: this.config.indexMain,
    }
    const params = {
      body: {
        actions: actions,
      },
    }
    console.debug('Switch Alias', params)
    return this.esClient.indices.updateAliases(params)
  }

  async createIndex(codeVersion) {
    const name = this.getIndexNameForVersion(codeVersion)
    const params = {
      index: name,
    }
    console.debug('Create Index', params)
    return this.esClient.indices
      .create(params)
      .then(() => this.switchAlias(null, name))
  }

  async createTemplate(config) {
    const templateName = this.templateName
    console.debug('Create template', templateName)
    return this.esClient.indices.putTemplate({
      name: templateName,
      body: config,
    })
  }

  createConfig(dictVersion, packageIds) {
    let config = fs.readFileSync(this.config.codeTemplateFile).toString()
    for (let type in packageIds) {
      const esPackage = packageIds[type]
      const key = '{' + type.toUpperCase() + '}'
      config = config.replace(key, esPackage.packageId)
    }
    return config
  }

  async associatePackagesIfNeeded(packageIds) {
    const domainPackages = await this.getDomainPackages()
    console.debug('Found domain packages', domainPackages)
    for (let type in packageIds) {
      const esPackage = packageIds[type]
      const id = esPackage.packageId
      const tmp = domainPackages[id]
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

  async getDomainPackages() {
    console.debug('GetDomainPackages')
    return this.awsEs
      .listPackagesForDomain({
        DomainName: this.config.esDomain,
      })
      .promise()
      .then((list) => {
        const ret = {}
        for (let i in list.DomainPackageDetailsList) {
          const p = list.DomainPackageDetailsList[i]
          console.debug('Domain listing', p)
          ret[p.PackageID] = p.DomainPackageStatus === 'ACTIVE'
        }
        return ret
      })
  }

  async createPackagesIfNeeded(dictionaryVersion, packageIds) {
    const neededTypes = ['stemmer', 'keywords', 'stopwords', 'synonyms']
    for (let i in neededTypes) {
      const type = neededTypes[i]
      if (!packageIds[type]) {
        const p = await this.migrateDictionary(dictionaryVersion, type)
        if (!p) {
          throw new Error('Could not create dictionary file for ' + type)
        }
        packageIds[type] = p
      }
    }
    return packageIds
  }

  async migrateDictionary(version, type) {
    return this.pushToS3(type).then(() => this.createPackage(version, type))
  }

  async dissociatePackage(esPackage) {
    const params = {
      DomainName: this.config.esDomain,
      PackageID: esPackage.packageId,
    }
    console.info('DisAssociate Package', params)
    const response = await this.awsEs.dissociatePackage(params).promise()
    await this.waitForPackageStatus(
      response.DomainPackageDetails,
      null,
      'DISSOCIATING',
      5,
    )

    console.info('Associate Package DONE', params)
    return esPackage
  }

  async associatePackage(esPackage) {
    const params = {
      DomainName: this.config.esDomain,
      PackageID: esPackage.packageId,
    }
    console.info('Associate Package', params)
    const response = await this.awsEs.associatePackage(params).promise()
    await this.waitForPackageStatus(
      response.DomainPackageDetails,
      'ACTIVE',
      'ASSOCIATING',
      5,
    )

    console.info('Associate Package DONE', params)
    return esPackage
  }

  createS3Key(type) {
    return this.config.s3Folder + this.lang + '/' + type + '.txt'
  }

  async createPackage(version, type) {
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
    console.info('Create Package', params)
    return this.awsEs
      .createPackage(params)
      .promise()
      .then((packageResponse) =>
        this.waitForPackageStatus(packageResponse, 'AVAILABLE', 'COPYING', 3),
      )
      .then((packageResponse) => {
        return EsPackage.create(packageResponse)
      })
  }

  findStatus(response) {
    if (response.DomainPackageStatus) {
      return response.DomainPackageStatus
    }
    if (response.PackageStatus) {
      return response.PackageStatus
    }
    return null
  }

  async waitForPackageStatus(
    response,
    expectedStatus,
    waitingStatus,
    sleepSec,
  ) {
    const inboundStatus = this.findStatus(response)
    console.debug('WaitForPackageStatus', {
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

    const describeParams = {
      Filters: [
        {
          Name: 'PackageID',
          Value: [response.PackageID],
        },
      ],
    }
    console.debug('Check for package', describeParams)
    const res = await this.awsEs.describePackages(describeParams).promise()
    if (expectedStatus === 'ACTIVE') {
      expectedStatus = 'AVAILABLE'
    }
    return await this.waitForPackageStatus(
      res.PackageDetailsList[0],
      expectedStatus,
      waitingStatus,
      sleepSec,
    )
  }

  async sleep(sec) {
    return new Promise((resolve) => {
      setTimeout(resolve, sec * 1000)
    })
  }

  async pushToS3(type) {
    const s3 = new AWS.S3()
    const url = this.getDictUrl(type)
    const pass = new stream.PassThrough()
    const key = this.createS3Key(type)
    console.info('Push To S3', {
      key: key,
    })
    return fetch(url).then((res) => {
      return s3.upload({
        Bucket: this.config.s3Bucket,
        Key: key,
        Body: res.body.pipe(pass),
      })
    })
  }

  async getAllPackageIdsForVersion(version) {
    return this.awsEs
      .describePackages()
      .promise()
      .then((list) => {
        const ret = {}
        for (let i in list.PackageDetailsList) {
          const p = list.PackageDetailsList[i]
          const t = EsPackage.create(p)
          if (t && t.dictVersion === version) {
            ret[t.dictType] = t
          }
        }
        return ret
      })
  }

  getDictFileName(name, version) {
    return util.format('%s-%s-%s', this.lang, name, version)
  }

  getDictUrl(type) {
    const url = this.config.dictRepo
      .replace('api.github', 'github')
      .replace('/repos/', '/')
    return util.format('%s/%s/%s.txt', url, this.lang, type)
  }

  async getDictionaryVersion() {
    const url = this.config.dictRepo + '/releases/latest'
    return fetch(url)
      .then((raw) => {
        return raw.json()
      })
      .then((data) => {
        return data.tag_name
      })
  }

  getCodeVersion() {
    const x = require(this.config.codeTemplateFile)
    return x.version
  }

  async esHasVersion(version) {
    const indexName = this.getIndexNameForVersion(version)
    console.debug('Checking if index exists', indexName)
    const result = await this.esClient.indices.exists({
      index: indexName,
    })
    return result.body
  }

  getIndexNameForVersion(version) {
    return util.format('island-is-v%d', version)
  }
}

const config = Config.createFromEnv(process.env)
if (!config.isValid()) {
  console.error('Config not valid', config)
  return
}

const app = new App(config)
app.run()
