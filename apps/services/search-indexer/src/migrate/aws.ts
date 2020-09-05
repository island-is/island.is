import { logger } from '@island.is/logging'
import AWS from 'aws-sdk'
import { DomainPackageDetails, PackageDetails } from 'aws-sdk/clients/es'
import fetch from 'node-fetch'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import { environment } from '../environments/environment'

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

class PackageIds extends Map<string, EsPackage> { }
class PackageStatuses extends Map<string, boolean> { }

AWS.config.update({ region: environment.migrate.awsRegion })
export const awsEs = new AWS.ES()
const s3 = new AWS.S3()

// checks connection and valdiates that we have access to requested domain
export const checkAWSAccess = async (): Promise<boolean> => {
  const domains = await awsEs.listDomainNames().promise()

  logger.info('Validating esDomain agains aws domain list', { domains })
  return !!domains.DomainNames.find(
    (domain) => domain.DomainName === environment.migrate.esDomain,
  )
}

const createS3Key = (type: string, prefix = ''): string => {
  const prefixFolder = prefix ? `${prefix}/` : ''
  return `${environment.migrate.s3Folder}${prefixFolder}${type}.txt`
}

export const getDictionaryVersion = (): Promise<string> => {
  const params = {
    Bucket: environment.migrate.s3Bucket,
    Key: createS3Key('dictionaryVersion')
  }

  // we don't want to stop here even if file is not found
  return s3.getObject(params)
    .promise()
    .then(data => data.Body.toString())
    .catch((error) => {
      logger.error('version file not found', { error })
      return ''
    })
}

const uploadFileToS3 = (options) => {
  const params = {
    Bucket: environment.migrate.s3Bucket,
    ...options
  }
  logger.info('uploading file to s3', { params })
  return s3.upload(params).promise()
}

export const updateDictionaryFiles = async (dictionaryUrl) => {
  // loop through locales
  /*return Object.entries(dictionaryUrl).reduce(async (localePackages, [locale, dictionaryUrls]) => {
    // loop through each analyzer for locale
    localePackages[locale] = await Promise.all(Object.entries(dictionaryUrls).map(async ([analyzer, analyzerUrl]) => {
      const fileStream = await getFile(analyzerUrl)
      const s3Key = createS3Key(analyzer, locale)
      return uploadFileToS3({ key: s3Key, Body: fileStream })
    }))

    return localePackages
  }, {})*/


  // TODO: Upload repo files to s3
  // TODO: Assosiate  ed files with ES
  // TODO: Return packageIds list for ES config
}

export const updateDictionaryVersion = async (newDictionaryVersion: string) => {
  const params = {
    Bucket: environment.migrate.s3Bucket,
    Key: createS3Key('dictionaryVersion'),
    Body: 'sometext'//newDictionaryVersion,
  }
  await s3.upload(params).promise()
  logger.info('updated dictionary version to', { version: newDictionaryVersion })
}

const pushToS3 = async (type: string): Promise<any> => {
  const url = ''//getDictUrl(type)
  const key = createS3Key(type)
  logger.info('Push To S3', {
    key: key,
    url: url,
    bucket: environment.migrate.s3Bucket,
  })
  const response = await fetch(url)
  logger.debug('Start s3 upload', { url: url, r: response })
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: environment.migrate.s3Bucket,
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

export const getAllPackageIdsForVersion = async (
  version: string,
): Promise<PackageIds> => {
  const list = await awsEs.describePackages().promise()
  logger.info('packageList', list)
  const ret: PackageIds = new PackageIds()
  list.PackageDetailsList.forEach((element) => {
    logger.info('proccessing package', { element })
    const t = EsPackage.create(element)
    logger.debug('Should add Version package?', {
      t: t,
      v: version,
      p: environment.migrate.packagePrefix,
    })
    if (
      t &&
      t.dictVersion === version &&
      t.packagePrefix === environment.migrate.packagePrefix
    ) {
      logger.info('setting package')
      ret.set(t.dictType, t)
    }
  })
  logger.info('returning', { ret: ret.get('stemmer') })
  return ret
}

export const getDomainPackages = (): Promise<PackageStatuses> => {
  logger.debug('GetDomainPackages')
  return awsEs
    .listPackagesForDomain({
      DomainName: environment.migrate.esDomain,
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

export const associatePackagesIfNeeded = async (packageIds: PackageIds) => {
  const domainPackages = await getDomainPackages()
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
      await dissociatePackage(esPackage)
      return associatePackagesIfNeeded(packageIds)
    }

    if (!tmp) {
      await associatePackage(esPackage)
    }
  }
  return packageIds
}

const dissociatePackage = async (esPackage: EsPackage): Promise<EsPackage> => {
  const params = {
    DomainName: environment.migrate.esDomain,
    PackageID: esPackage.packageId,
  }
  logger.info('DisAssociate Package', params)
  const response = await awsEs.dissociatePackage(params).promise()
  await waitForPackageStatus(
    response.DomainPackageDetails,
    null,
    'DISSOCIATING',
    5,
    () => {
      return getDomainPackage(esPackage.packageId)
    },
  )

  logger.info('Associate Package DONE', params)
  return esPackage
}

// to make package accessable is ES domain
const associatePackage = async (esPackage: EsPackage): Promise<EsPackage> => {
  const params = {
    DomainName: environment.migrate.esDomain,
    PackageID: esPackage.packageId,
  }
  logger.info('Associate Package', params)
  const response = await awsEs.associatePackage(params).promise()
  await waitForPackageStatus(
    response.DomainPackageDetails,
    'ACTIVE',
    'ASSOCIATING',
    5,
    () => {
      return getDomainPackage(esPackage.packageId)
    },
  )

  logger.info('Associate Package DONE', params)

  return esPackage
}

const getDomainPackage = async (
  packageId: string,
): Promise<DomainPackageDetails> => {
  return awsEs
    .listPackagesForDomain({
      DomainName: environment.migrate.esDomain,
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

const getPackage = (packageId: string): Promise<PackageDetails> => {
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

const createPackage = (version: string, type: string): Promise<EsPackage> => {
  const packageName = getDictFileName(type, version)
  const packageType = 'TXT-DICTIONARY'
  const key = createS3Key(type)

  const params = {
    PackageName: packageName,
    PackageType: packageType,
    PackageSource: {
      S3BucketName: environment.migrate.s3Bucket,
      S3Key: key,
    },
  }
  logger.info('Create Package', params)
  return awsEs
    .createPackage(params)
    .promise()
    .then((packageResponse: AWS.ES.CreatePackageResponse) =>
      waitForPackageStatus(
        packageResponse.PackageDetails,
        'AVAILABLE',
        'COPYING',
        3,
        (packageId: string) => {
          return getPackage(packageId)
        },
      ),
    )
    .then((packageResponse) => {
      return EsPackage.create(packageResponse)
    })
}

const migrateDictionary = (
  version: string,
  type: string,
): Promise<EsPackage> => {
  return pushToS3(type).then(() => createPackage(version, type))
}

export const createPackagesIfNeeded = async (
  dictionaryVersion: string,
  packageIds: PackageIds,
): Promise<PackageIds> => {
  const neededTypes = ['stemmer', 'keywords', 'stopwords', 'synonyms']
  for (const type of neededTypes) {
    if (!packageIds.has(type)) {
      const p = await migrateDictionary(dictionaryVersion, type)
      if (!p) {
        throw new Error('Could not create dictionary file for ' + type)
      }
      packageIds[type] = p
    }
  }
  logger.debug('CreatePIfNeeded', { ret: packageIds })
  return packageIds
}

const waitForPackageStatus = async (
  response,
  expectedStatus: string,
  waitingStatus: string,
  sleepSec: number,
  responseCallback,
) => {
  const inboundStatus = findStatus(response)
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

  await sleep(sleepSec)

  logger.debug('Calling response callback')
  const res = await responseCallback(response.PackageID)
  return await waitForPackageStatus(
    res,
    expectedStatus,
    waitingStatus,
    sleepSec,
    responseCallback,
  )
}

const getDictFileName = (name: string, version: string) => {
  let prefix = environment.migrate.packagePrefix
  if (prefix) {
    prefix += '-'
  }
  return `${prefix}${'is'}-${name}-${version}`
}

const sleep = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

const findStatus = (response) => {
  if ((response as DomainPackageDetails).DomainPackageStatus !== undefined) {
    return response.DomainPackageStatus
  }
  if ((response as PackageDetails).PackageStatus !== undefined) {
    return response.PackageStatus
  }
  return null
}
