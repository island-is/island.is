import { logger } from '@island.is/logging'
import AWS from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { environment } from '../environments/environment'
import _ from 'lodash'
import { Dictionary } from './dictionary'
import { localeIS } from 'date-fns/locale/is';

AWS.config.update({ region: environment.migrate.awsRegion })
const awsEs = new AWS.ES()
const s3 = new AWS.S3()

const sleep = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

// construct the name used for packages in AWS ES
const createPackageName = (locale: string, analyzerType: string, version: string) => {
  return `${locale}-${analyzerType}-${version}`
}

// break down the name used for packages in AWS ES
const parsePackageName = (packageName: string) => {
  const [locale, analyzerType, version] = packageName.split('-')
  return {
    locale,
    analyzerType,
    version
  }
}

interface PackageStatus {
  packageStatus: string
  domainStatus: string
}

const getPackageStatuses = async (packageId: string): Promise<PackageStatus> => {
  const params = {
    Filters: [
      {
        Name: 'PackageID',
        Value: [packageId],
      },
    ],
  }
  const packages = await awsEs
    .describePackages(params)
    .promise()

  const domainPackageList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.migrate.esDomain,
    })
    .promise()

  const foundPackage = domainPackageList.DomainPackageDetailsList.find((listItem) => listItem.PackageID === packageId)

  return {
    packageStatus: packages.PackageDetailsList[0].PackageStatus,
    domainStatus: foundPackage?.DomainPackageStatus ?? 'NONE'
  }
}

export const getAllDomainEsPackages = async (): Promise<AwsEsPackage[]> => {
  const domainPackageList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.migrate.esDomain,
    })
    .promise()
  return domainPackageList.DomainPackageDetailsList.map((esPackage) => {
    const { locale, analyzerType } = parsePackageName(esPackage.PackageName)
    return {
      packageId: esPackage.PackageID,
      locale,
      analyzerType
    }
  })
}

// AWS ES wont let us make multiple requests at once so we wait
const waitForPackageStatus = async (
  packageId: string,
  desiredStatus: string,
  totalSecondsWaited = 0
) => {
  const secondsBetweenRequests = 5
  const timeoutSeconds = 300

  if (totalSecondsWaited >= timeoutSeconds) {
    throw new Error(`Failed to get status for package ${packageId}`)
  }

  // if we find the desired status in eather the domain package list or the unassigned package list we assume success
  const { packageStatus, domainStatus } = await getPackageStatuses(packageId)
  if (packageStatus === desiredStatus || domainStatus === desiredStatus) {
    return true
  }

  logger.info('waiting for correct package status', {
    packageId,
    desiredStatus,
    currentPackageStatus: packageStatus,
    currentDomainStatus: domainStatus,
    secondsBetweenRequests,
    totalSecondsWaited
  })

  // wait X seconds to make next status request
  await sleep(secondsBetweenRequests)

  return await waitForPackageStatus(
    packageId,
    desiredStatus,
    totalSecondsWaited = totalSecondsWaited + secondsBetweenRequests
  )
}

// checks connection and valdiates that we have access to requested domain
export const checkAWSAccess = async (): Promise<boolean> => {
  const domains = await awsEs.listDomainNames().promise()
    .then((domains) => domains.DomainNames)
    .catch((error) => {
      logger.error('failed to check aws access', { error })
      // return empty list to indicate no access
      return []
    })

  logger.info('validating esDomain agains aws domain list', { domains })
  return !!domains.find(
    (domain) => domain.DomainName === environment.migrate.esDomain,
  )
}

const createS3Key = (type: string, prefix = ''): string => {
  const prefixString = prefix ? `${prefix}/` : ''
  return `${environment.migrate.s3Folder}${prefixString}${type}.txt`
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
      // return empty string to indicate no version set
      return ''
    })
}

const uploadFileToS3 = (options: Omit<PutObjectRequest, 'Bucket'>) => {
  const params = {
    Bucket: environment.migrate.s3Bucket,
    ...options
  }
  logger.info('uploading file to s3', { Bucket: params.Bucket, Key: params.Key })
  return s3.upload(params).promise().catch((error) => {
    logger.error('failed to upload s3 package', error)
    throw error
  })
}

interface S3DictionaryFile {
  locale: string
  analyzerType: string
}
export const updateS3DictionaryFiles = async (dictionaries: Dictionary[]): Promise<S3DictionaryFile[]> => {
  const uploads = dictionaries.map(async (dictionary) => {
    const { analyzerType, locale, file } = dictionary
    const s3Key = createS3Key(analyzerType, locale)
    await uploadFileToS3({ Key: s3Key, Body: file })
    return {
      locale,
      analyzerType
    }
  })

  return Promise.all(uploads)
}

const getDomainPackagesDetails = async () => {
  logger.info('geting all domain packages', { domain: environment.migrate.esDomain })
  const domainPackagesList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.migrate.esDomain,
    }).promise()

  return domainPackagesList.DomainPackageDetailsList
}

const removePackagesIfExist = async (uploadedDictionaryFiles: S3DictionaryFile[], version: string) => {
  const domainPackages = await getDomainPackagesDetails()

  // search domainPackages to check of any package exist
  const responses = uploadedDictionaryFiles.map(async (uploadedFile) => {
    const { analyzerType, locale } = uploadedFile
    const packageName = createPackageName(locale, analyzerType, version)
    const existingPackage = domainPackages.find((domainPackage) => domainPackage.PackageName === packageName)

    if (existingPackage) {
      logger.info('found conflicting AWS ES package, removing existing package to prevent conflict', { existingPackage, packageName })
      const params = {
        PackageID: existingPackage.PackageID
      }

      // this package should never be in use so we can delete it
      return awsEs.deletePackage(params).promise()
    } else {
      // no file found, return promise
      return false
    }
  })

  // wait for all request to resolve
  await Promise.all(responses)
  return true
}

/*
createAwsEsPackagesshould only run when we are updating, we can therefore assume no assigned packages exist in AWS ES for this version
We run a remove packages for this verson function to handle failed partial updates
*/
export interface AwsEsPackage {
  packageId: string
  locale: string
  analyzerType: string
}
export const createAwsEsPackages = async (uploadedDictionaryFiles: S3DictionaryFile[], version: string): Promise<AwsEsPackage[]> => {
  // this handles failed updates, if everything works this should never remove packages
  await removePackagesIfExist(uploadedDictionaryFiles, version) // TODO: Get access for this in AWS ES

  // create a new package for each uploaded s3 file
  const createdPackages = uploadedDictionaryFiles.map(async (uploadedFile) => {
    const { analyzerType, locale } = uploadedFile

    const params = {
      PackageName: createPackageName(locale, analyzerType, version), // version is here so we dont conflict with older packages
      PackageType: 'TXT-DICTIONARY',
      PackageSource: {
        S3BucketName: environment.migrate.s3Bucket,
        S3Key: createS3Key(analyzerType, locale),
      },
    }

    logger.info('Creating AWS ES package', params)

    const esPackage = await awsEs
      .createPackage(params)
      .promise()

    // we have to wait for package to be ready cause AWS ES can only process one request at a time
    await waitForPackageStatus(
      esPackage.PackageDetails.PackageID,
      'AVAILABLE'
    )

    logger.info('Created AWS ES package', { esPackage })

    return {
      packageId: esPackage.PackageDetails.PackageID,
      locale,
      analyzerType
    }
  })

  return Promise.all(createdPackages)
}

export const associatePackagesWithAwsEs = async (packages: AwsEsPackage[]) => {
  // do one at a time
  for (const awsEsPackage of packages) {
    const params = {
      DomainName: environment.migrate.esDomain,
      PackageID: awsEsPackage.packageId,
    }

    logger.info('associating package with AWS ES instance', params)
    const esPackage = await awsEs.associatePackage(params).promise()

    // we have to wait for package to be ready cause AWS ES can only process one request at a time
    await waitForPackageStatus(
      esPackage.DomainPackageDetails.PackageID,
      'ACTIVE'
    )
  }

  logger.info('successfully associated all packages with AWS ES instance')
  return true
}

export const updateDictionaryVersion = async (newDictionaryVersion: string) => {
  const params = {
    Key: createS3Key('dictionaryVersion'),
    Body: newDictionaryVersion,
  }
  await uploadFileToS3(params)
  logger.info('updated dictionary version to', { version: newDictionaryVersion })
}
