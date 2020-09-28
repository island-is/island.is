import { logger } from '@island.is/logging'
import AWS from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { environment } from '../environments/environment'
import { Dictionary } from './dictionary'
import { PackageStatus, DomainPackageStatus } from 'aws-sdk/clients/es'

AWS.config.update({ region: environment.awsRegion })
const awsEs = new AWS.ES()
const s3 = new AWS.S3()

const sleep = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

// construct the name used for packages in AWS ES
const createPackageName = (
  locale: string,
  analyzerType: string,
  version: string,
) => {
  return `${locale}-${analyzerType}-${version}`
}

// break down the name used for packages in AWS ES
const parsePackageName = (packageName: string) => {
  const [locale, analyzerType, version] = packageName.split('-')
  return {
    locale,
    analyzerType,
    version,
  }
}

interface PackageStatuses {
  packageStatus: PackageStatus
  domainStatus: DomainPackageStatus
}

const getPackageStatuses = async (
  packageId: string,
): Promise<PackageStatuses> => {
  const params = {
    Filters: [
      {
        Name: 'PackageID',
        Value: [packageId],
      },
    ],
  }
  const packages = await awsEs.describePackages(params).promise()

  const domainPackageList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.esDomain,
    })
    .promise()

  const domainPackage = domainPackageList.DomainPackageDetailsList.find(
    (listItem) => listItem.PackageID === packageId,
  )

  return {
    packageStatus: packages.PackageDetailsList[0].PackageStatus,
    domainStatus: domainPackage?.DomainPackageStatus ?? 'DISSOCIATED',
  }
}

export const getAllDomainEsPackages = async (): Promise<AwsEsPackage[]> => {
  const domainPackageList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.esDomain,
    })
    .promise()
  return domainPackageList.DomainPackageDetailsList.map((esPackage) => {
    const { locale, analyzerType } = parsePackageName(esPackage.PackageName)
    return {
      packageId: esPackage.PackageID,
      locale,
      analyzerType,
    }
  })
}

// AWS ES wont let us make multiple requests at once so we wait
const waitForPackageStatus = async (
  packageId: string,
  desiredStatus: PackageStatus | DomainPackageStatus,
  totalSecondsWaited = 0,
) => {
  const secondsBetweenRequests = 5
  const timeoutSeconds = 300

  if (totalSecondsWaited >= timeoutSeconds) {
    throw new Error(`Failed to get status for package ${packageId}`)
  }

  // if we find the desired status in either the domain package list or the unassigned package list we assume success
  const { packageStatus, domainStatus } = await getPackageStatuses(packageId)
  if (packageStatus === desiredStatus || domainStatus === desiredStatus) {
    return true
  }

  logger.info('Waiting for correct package status', {
    packageId,
    desiredStatus,
    currentPackageStatus: packageStatus,
    currentDomainStatus: domainStatus,
    secondsBetweenRequests,
    totalSecondsWaited,
  })

  // wait X seconds to make next status request
  await sleep(secondsBetweenRequests)

  return await waitForPackageStatus(
    packageId,
    desiredStatus,
    (totalSecondsWaited = totalSecondsWaited + secondsBetweenRequests),
  )
}

// checks connection and validates that we have access to requested domain
export const checkAWSAccess = async (): Promise<boolean> => {
  if (!environment.s3Bucket) {
    logger.info('No credentials provided for AWS')
    return false
  }

  const domains = await awsEs
    .listDomainNames()
    .promise()
    .then((domains) => domains.DomainNames)
    .catch((error) => {
      logger.error('Failed to check aws access', { error })
      // return empty list to indicate no access
      return []
    })

  logger.info('Validating esDomain agains aws domain list', { domains })
  return !!domains.find((domain) => domain.DomainName === environment.esDomain)
}

const createS3Key = (type: string, prefix = ''): string => {
  const prefixString = prefix ? `${prefix}/` : ''
  return `${environment.s3Folder}${prefixString}${type}.txt`
}

export const getDictionaryVersion = (): Promise<string> => {
  const params = {
    Bucket: environment.s3Bucket,
    Key: createS3Key('dictionaryVersion'),
  }

  // we don't want to stop here even if file is not found
  return s3
    .getObject(params)
    .promise()
    .then((data) => data.Body.toString())
    .catch((error) => {
      logger.error('Version file not found', { error })
      // return empty string to indicate no version set
      return ''
    })
}

const uploadFileToS3 = (options: Omit<PutObjectRequest, 'Bucket'>) => {
  const params = {
    Bucket: environment.s3Bucket,
    ...options,
  }
  logger.info('Uploading file to s3', {
    Bucket: params.Bucket,
    Key: params.Key,
  })
  return s3
    .upload(params)
    .promise()
    .catch((error) => {
      logger.error('Failed to upload s3 package', error)
      throw error
    })
}

interface S3DictionaryFile {
  locale: string
  analyzerType: string
}
export const updateS3DictionaryFiles = async (
  dictionaries: Dictionary[],
): Promise<S3DictionaryFile[]> => {
  const uploads = dictionaries.map(async (dictionary) => {
    const { analyzerType, locale, file } = dictionary
    const s3Key = createS3Key(analyzerType, locale)
    await uploadFileToS3({ Key: s3Key, Body: file })
    return {
      locale,
      analyzerType,
    }
  })

  return Promise.all(uploads)
}

const getAwsEsPackagesDetails = async () => {
  logger.info('Getting all AWS ES packages')
  const packages = await awsEs.describePackages().promise()

  return packages.PackageDetailsList
}

const removePackagesIfExist = async (
  uploadedDictionaryFiles: S3DictionaryFile[],
  version: string,
) => {
  const esPackages = await getAwsEsPackagesDetails()

  logger.info('Checking if we have conflicting packages')
  // search esPackages to check of any package exist
  const responses = uploadedDictionaryFiles.map(async (uploadedFile) => {
    const { analyzerType, locale } = uploadedFile
    const packageName = createPackageName(locale, analyzerType, version)
    const existingPackage = esPackages.find(
      (esPackage) => esPackage.PackageName === packageName,
    )

    if (existingPackage) {
      logger.info(
        'Found conflicting AWS ES package, removing existing package to prevent conflict',
        { existingPackage, packageName },
      )
      const params = {
        PackageID: existingPackage.PackageID,
      }

      // this package should never be in use so we can delete it
      return awsEs
        .deletePackage(params)
        .promise()
        .catch((error) => {
          logger.info('Unable to remove conflicting package', {
            error: error,
            existingPackage: existingPackage,
          })
          return false
        })
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
createAwsEsPackages should only run when we are updating, we can therefore assume no assigned packages exist in AWS ES for this version
We run a remove packages for this version function to handle failed partial updates
*/
export interface AwsEsPackage {
  packageId: string
  locale: string
  analyzerType: string
}
export const createAwsEsPackages = async (
  uploadedDictionaryFiles: S3DictionaryFile[],
  version: string,
): Promise<AwsEsPackage[]> => {
  // this handles failed updates, if everything works this should never remove packages
  await removePackagesIfExist(uploadedDictionaryFiles, version)

  // create a new package for each uploaded s3 file
  const createdPackages = uploadedDictionaryFiles.map(async (uploadedFile) => {
    const { analyzerType, locale } = uploadedFile

    const params = {
      PackageName: createPackageName(locale, analyzerType, version), // version is here so we dont conflict with older packages
      PackageType: 'TXT-DICTIONARY',
      PackageSource: {
        S3BucketName: environment.s3Bucket,
        S3Key: createS3Key(analyzerType, locale),
      },
    }

    logger.info('Creating AWS ES package', params)

    const esPackage = await awsEs.createPackage(params).promise()

    // we have to wait for package to be ready cause AWS ES can only process one request at a time
    await waitForPackageStatus(esPackage.PackageDetails.PackageID, 'AVAILABLE')

    logger.info('Created AWS ES package', { esPackage })

    return {
      packageId: esPackage.PackageDetails.PackageID,
      locale,
      analyzerType,
    }
  })

  return Promise.all(createdPackages)
}

export const associatePackagesWithAwsEs = async (packages: AwsEsPackage[]) => {
  // do one at a time
  for (const awsEsPackage of packages) {
    const params = {
      DomainName: environment.esDomain,
      PackageID: awsEsPackage.packageId,
    }

    logger.info('Associating package with AWS ES instance', params)
    const esPackage = await awsEs.associatePackage(params).promise()

    // we have to wait for package to be ready cause AWS ES can only process one request at a time
    await waitForPackageStatus(
      esPackage.DomainPackageDetails.PackageID,
      'ACTIVE',
    )
  }

  logger.info('Successfully associated all packages with AWS ES instance')
  return true
}

export const getUnusedEsPackages = async (
  inUseEsPackages: AwsEsPackage[],
): Promise<string[]> => {
  const allAwsEsPackages = await getAwsEsPackagesDetails()
  const allAwsEsPackageIds = allAwsEsPackages.map(
    (awsEsPackage) => awsEsPackage.PackageID,
  )
  const inUseEsPackageIds = inUseEsPackages.map(
    (inUseEsPackage) => inUseEsPackage.packageId,
  )

  // we remove packages that are in use from allAwsEsPackageIds and return
  return allAwsEsPackageIds.filter(
    (awsEsPackageId) => !inUseEsPackageIds.includes(awsEsPackageId),
  )
}

export const getUnusedAwsEsPackages = async (
  inUseEsPackages: AwsEsPackage[],
): Promise<string[]> => {
  const allAwsEsDomainPackages = await getAllDomainEsPackages()
  const inuseEsPackageIds = inUseEsPackages.map(
    (esPackage) => esPackage.packageId,
  )
  const inuseAwsEsPackageIds = allAwsEsDomainPackages.map(
    (awsEsPackage) => awsEsPackage.packageId,
  )
  return inuseAwsEsPackageIds.filter(
    (awsEsDomainPackageId) => !inuseEsPackageIds.includes(awsEsDomainPackageId),
  )
}

export const disassociateUnusedPackagesFromAwsEs = async (
  inUseEsPackages: AwsEsPackage[],
) => {
  logger.info('Disassociating old packages from AWS ES')
  const packagesToRemove = await getUnusedAwsEsPackages(inUseEsPackages)
  for (const esAwsPackageId of packagesToRemove) {
    logger.info('Disassociating package', { packageId: esAwsPackageId })
    const params = {
      DomainName: environment.esDomain,
      PackageID: esAwsPackageId,
    }
    await awsEs.dissociatePackage(params).promise()

    // we have to wait for package to be ready cause AWS ES can only process one request at a time
    await waitForPackageStatus(esAwsPackageId, 'DISSOCIATED')
  }
  logger.info('Disassociated all old packages')
  return true
}

export const deleteUnusedPackagesFromAwsEs = async (
  inUseEsPackages: AwsEsPackage[],
) => {
  logger.info('Deleting old packages from AWS ES')
  const unusedEsPackageIds = await getUnusedEsPackages(inUseEsPackages)
  unusedEsPackageIds.map((esPackageId) => {
    logger.info('Deleting package', { packageId: esPackageId })
    const params = {
      PackageID: esPackageId,
    }

    return awsEs.deletePackage(params).promise()
  })
  logger.info('Deleted all old packages')
  return true
}

export const updateDictionaryVersion = async (newDictionaryVersion: string) => {
  const params = {
    Key: createS3Key('dictionaryVersion'),
    Body: newDictionaryVersion,
  }
  await uploadFileToS3(params)
  logger.info('Updated dictionary version to', {
    version: newDictionaryVersion,
  })
}
