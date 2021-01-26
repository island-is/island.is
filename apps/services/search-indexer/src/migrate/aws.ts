import { logger } from '@island.is/logging'
import AWS from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { environment } from '../environments/environment'
import { Dictionary } from './dictionary'
import { PackageStatus, DomainPackageStatus } from 'aws-sdk/clients/es'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

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
export const parsePackageName = (packageName: string) => {
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

export const getAssociatedEsPackages = async (
  requestedVersion: string,
): Promise<AwsEsPackage[]> => {
  const domainPackageList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.esDomain,
    })
    .promise()

  return (
    domainPackageList.DomainPackageDetailsList
      // we only want to return packages for current version
      .filter((esPackage) => {
        const { version } = parsePackageName(esPackage.PackageName)
        return requestedVersion === version
      })
      .map((esPackage) => {
        const { locale, analyzerType } = parsePackageName(esPackage.PackageName)
        return {
          packageName: esPackage.PackageName,
          packageId: esPackage.PackageID,
          locale: locale as ElasticsearchIndexLocale,
          analyzerType,
        }
      })
  )
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

interface CreateS3KeyInput {
  filename: string
  locale?: ElasticsearchIndexLocale
  version?: string
}
const createS3Key = ({
  filename,
  locale,
  version,
}: CreateS3KeyInput): string => {
  const prefix = [locale, version, '']
    .filter((parameter) => parameter !== undefined)
    .join('/') // creates folder prefix e.g. is/4cc9840/
  return `${environment.s3Folder}${prefix}${filename}.txt`
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
  locale: ElasticsearchIndexLocale
  analyzerType: string
  version: string
}
export const uploadS3DictionaryFiles = async (
  dictionaries: Dictionary[],
): Promise<S3DictionaryFile[]> => {
  const uploads = dictionaries.map(async (dictionary) => {
    const { analyzerType, locale, file, version } = dictionary

    // we will upload the files into subfolders by locale
    const s3Key = createS3Key({ filename: analyzerType, locale, version })
    await uploadFileToS3({ Key: s3Key, Body: file })

    // the following processes just need a way to point correctly to the files
    return {
      locale,
      analyzerType,
      version,
    }
  })

  return await Promise.all(uploads)
}

const getAwsEsPackagesDetails = async () => {
  logger.info('Getting all AWS ES packages')
  const packages = await awsEs.describePackages().promise()

  return packages.PackageDetailsList
}

const removePackagesIfExist = async (
  uploadedDictionaryFiles: S3DictionaryFile[],
) => {
  const esPackages = await getAwsEsPackagesDetails()

  logger.info('Checking if we have conflicting packages')
  // search esPackages to check of any package exist
  const responses = uploadedDictionaryFiles.map(async (s3File) => {
    const { analyzerType, locale, version } = s3File
    const packageName = createPackageName(locale, analyzerType, version)
    const existingPackage = esPackages.find(
      (esPackage) => esPackage.PackageName === packageName,
    )

    if (existingPackage) {
      logger.info('Removing existing AWS ES package', { existingPackage })
      const params = {
        PackageID: existingPackage.PackageID,
      }

      // this package should never associated so we can naively delete it
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
      // no file found
      return false
    }
  })

  // wait for all request to resolve
  await Promise.all(responses)
  return true
}

/*
createAwsEsPackages should only run when we are updating, we can therefore assume no assigned packages exist in AWS ES for this version
We run a remove packages for this version function to handle failed partial updates that might not have associated the package to the domain 
*/
export interface AwsEsPackage {
  packageName?: string
  packageId: string
  locale: ElasticsearchIndexLocale
  analyzerType: string
}
export const createAwsEsPackages = async (
  uploadedDictionaryFiles: S3DictionaryFile[],
): Promise<AwsEsPackage[]> => {
  // this handles failed updates, if everything works this should never remove packages
  await removePackagesIfExist(uploadedDictionaryFiles)

  // create a new package for each uploaded s3 file
  const createdPackages = uploadedDictionaryFiles.map(async (uploadedFile) => {
    const { analyzerType, locale, version } = uploadedFile

    const params = {
      PackageName: createPackageName(locale, analyzerType, version), // version is here so we dont conflict with older packages
      PackageType: 'TXT-DICTIONARY',
      PackageSource: {
        S3BucketName: environment.s3Bucket,
        S3Key: createS3Key({ filename: analyzerType, locale }),
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

export const associatePackagesWithAwsEsSearchDomain = async (
  packages: AwsEsPackage[],
) => {
  // we have to do one at a time due to limitations in AWS API
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

export const getFirstFoundAwsEsPackageVersion = async (
  dictionaryVersions: string[],
) => {
  const domainPackageList = await awsEs
    .listPackagesForDomain({
      DomainName: environment.esDomain,
    })
    .promise()

  // create an array containing all found es package versions
  const domainPackageVersions = domainPackageList.DomainPackageDetailsList.map(
    (esPackage) => {
      const { version } = parsePackageName(esPackage.PackageName)
      return version
    },
  )

  // find the highest version in AWS ES search domain if any exists
  for (const dictionaryVersion of dictionaryVersions) {
    if (domainPackageVersions.includes(dictionaryVersion)) {
      return dictionaryVersion
    }
  }

  return null // we found no version
}
