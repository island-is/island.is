import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import {
  ElasticsearchServiceClient,
  DescribePackagesCommand,
  ListPackagesForDomainCommand,
  ListDomainNamesCommand,
  CreatePackageCommand,
  AssociatePackageCommand,
  DissociatePackageCommand,
  PackageStatus,
  DomainPackageStatus,
  CreatePackageCommandInput,
} from '@aws-sdk/client-elasticsearch-service'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { logger } from '@island.is/logging'
import { environment } from '../../environments/environment'
import { Dictionary } from './dictionary'
import { Readable } from 'stream'

const ES_LOCALSTACK_ENDPOINT =
  process.env.ES_ENDPOINT ?? 'http://localhost:4566'
const S3_LOCALSTACK_ENDPOINT =
  process.env.S3_ENDPOINT ?? 'http://localhost:4566'

const awsEs = new ElasticsearchServiceClient({
  endpoint:
    process.env.NODE_ENV !== 'production' ? ES_LOCALSTACK_ENDPOINT : undefined,
})
const s3 = new S3Client({
  endpoint:
    process.env.NODE_ENV !== 'production' ? S3_LOCALSTACK_ENDPOINT : undefined,
})

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
  const describePackagesCommand = new DescribePackagesCommand({
    Filters: [
      {
        Name: 'PackageID',
        Value: [packageId],
      },
    ],
  })
  const packages = await awsEs.send(describePackagesCommand)

  const listPackagesForDomainCommand = new ListPackagesForDomainCommand({
    DomainName: environment.esDomain,
  })
  const domainPackageList = await awsEs.send(listPackagesForDomainCommand)

  const domainPackage = domainPackageList.DomainPackageDetailsList?.find(
    (listItem) => listItem.PackageID === packageId,
  )

  return {
    packageStatus: packages.PackageDetailsList?.[0]
      .PackageStatus as PackageStatus,
    domainStatus: domainPackage?.DomainPackageStatus ?? DomainPackageStatus.DISSOCIATING,
  }
}

export const getAssociatedEsPackages = async (
  requestedVersion: string,
): Promise<AwsEsPackage[]> => {
  const listPackagesForDomainCommand = new ListPackagesForDomainCommand({
    DomainName: environment.esDomain,
  })
  const domainPackageList = await awsEs.send(listPackagesForDomainCommand)

  return (
    domainPackageList.DomainPackageDetailsList?.filter((esPackage) => {
      const { version, locale, analyzerType } = parsePackageName(
        esPackage.PackageName ?? '',
      )
      logger.info('Found associated package for domain', {
        version,
        locale,
        analyzerType,
        requestedVersion,
        willBeUsed: requestedVersion === version,
      })
      return requestedVersion === version
    }).map((esPackage) => {
      const { locale, analyzerType } = parsePackageName(
        esPackage.PackageName ?? '',
      )
      return {
        packageName: esPackage.PackageName,
        packageId: esPackage.PackageID,
        locale: locale as ElasticsearchIndexLocale,
        analyzerType,
      }
    }) ?? []
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

  const listDomainNamesCommand = new ListDomainNamesCommand({})
  const domains = await awsEs
    .send(listDomainNamesCommand)
    .then((response) => response.DomainNames)
    .catch((error) => {
      logger.error('Failed to check aws access', { error })
      // return empty list to indicate no access
      return []
    })

  logger.info('Validating esDomain against aws domain list', { domains })
  return !!domains?.find((domain) => domain.DomainName === environment.esDomain)
}

interface CreateS3KeyInput {
  filename: string
  locale: ElasticsearchIndexLocale
  version: string
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

const uploadFileToS3 = async (
  options: Omit<PutObjectCommandInput, 'Bucket'>,
) => {
  const params = {
    Bucket: environment.s3Bucket,
    ...options,
  }
  logger.info('Uploading file to s3', {
    Bucket: params.Bucket,
    Key: params.Key,
  })
  try {
    return await s3.send(new PutObjectCommand(params))
  } catch (error) {
    logger.error('Failed to upload s3 package', error)
    throw error
  }
}

const checkIfS3Exists = async (key: string) => {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: environment.s3Bucket,
        Key: key,
      }),
    )
    return true
  } catch {
    return false
  } // we don't want this to throw on error so we can handle if not exists manually
}

interface S3DictionaryFile {
  locale: ElasticsearchIndexLocale
  analyzerType: string
  version: string
}

export const streamToBuffer = async (
  file: NodeJS.ReadableStream,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Readable)) {
      // In case the input is not a Readable stream (shouldn't happen due to typing)
      reject(new Error('Input is not a valid Readable stream'))
    }
    const chunks: Uint8Array[] = []
    file.on('data', (chunk) => chunks.push(chunk))
    file.on('end', () => {
      if (chunks.every((chunk) => typeof chunk === 'string')) {
        // If all chunks are strings, concatenate them and convert to Buffer
        resolve(Buffer.from(chunks.join('')))
      } else if (
        chunks.every(
          (chunk) => Buffer.isBuffer(chunk) || chunk instanceof Uint8Array,
        )
      ) {
        // If all chunks are Buffer or Uint8Array, use Buffer.concat
        resolve(Buffer.concat(chunks))
      } else {
        // For mixed types or object mode, stringify and convert to Buffer
        resolve(Buffer.from(JSON.stringify(chunks)))
      }
    })
    file.on('error', (err) => reject(err))
  })
}

export const uploadS3DictionaryFiles = async (
  dictionaries: Dictionary[],
): Promise<S3DictionaryFile[]> => {
  const uploads = dictionaries.map(async (dictionary) => {
    const { analyzerType, locale, file, version } = dictionary
    // we will upload the files into subfolders by locale
    const s3Key = createS3Key({ filename: analyzerType, locale, version })

    const exists = await checkIfS3Exists(s3Key)
    if (!exists) {
      logger.info('S3 file not found, uploading file', { key: s3Key })

      const uploadBody = await streamToBuffer(file)
      await uploadFileToS3({ Key: s3Key, Body: uploadBody })
    } else {
      logger.info('S3 file found, skipping upload of file', { key: s3Key })
    }

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
  const describePackagesCommand = new DescribePackagesCommand({
    MaxResults: 100,
  })
  const packages = await awsEs.send(describePackagesCommand)

  return packages.PackageDetailsList
}

const checkIfAwsEsPackageExists = async (
  packageName: string,
): Promise<string | null> => {
  const esPackages = await getAwsEsPackagesDetails()
  logger.info('Checking if package exists', { packageName })
  const foundPackage = esPackages?.find(
    (esPackage) => esPackage.PackageName === packageName,
  )
  return foundPackage?.PackageID ?? null
}

export interface AwsEsPackage {
  packageName?: string
  packageId: string
  locale: ElasticsearchIndexLocale
  analyzerType: string
}
export const createAwsEsPackages = async (
  uploadedDictionaryFiles: S3DictionaryFile[],
): Promise<AwsEsPackage[]> => {
  // create a new package for each uploaded s3 file
  const createdPackages = uploadedDictionaryFiles.map(async (uploadedFile) => {
    const { analyzerType, locale, version } = uploadedFile
    const packageName = createPackageName(locale, analyzerType, version)
    const foundPackageId = await checkIfAwsEsPackageExists(packageName)
    let uploadedPackageId: string

    if (!foundPackageId) {
      const params: CreatePackageCommandInput = {
        PackageName: createPackageName(locale, analyzerType, version), // version is here so we don't conflict with older packages
        PackageType: 'TXT-DICTIONARY',
        PackageSource: {
          S3BucketName: environment.s3Bucket,
          S3Key: createS3Key({ filename: analyzerType, locale, version }),
        },
      }

      logger.info('Creating AWS ES package', params)

      const createPackageCommand = new CreatePackageCommand(params)
      const esPackage = await awsEs.send(createPackageCommand)

      // we have to wait for package to be ready cause AWS ES can only process one request at a time
      await waitForPackageStatus(
        esPackage.PackageDetails?.PackageID ?? '',
        PackageStatus.AVAILABLE,
      )

      logger.info('Created AWS ES package', { esPackage })
      uploadedPackageId = esPackage.PackageDetails?.PackageID
    } else {
      logger.info('AWS ES package found, skipping upload of package', {
        packageId: foundPackageId,
      })
    }

    return {
      packageId: uploadedPackageId ?? foundPackageId,
      locale,
      analyzerType,
    }
  })

  return Promise.all(createdPackages)
}

const getDomainPackages = () => {
  const listPackagesForDomainCommand = new ListPackagesForDomainCommand({
    DomainName: environment.esDomain,
  })
  return awsEs.send(listPackagesForDomainCommand)
}

const getPackageAssociationStatus = async (
  packageId: string,
): Promise<'missing' | 'active' | 'broken'> => {
  const domainPackageList = await getDomainPackages()
  const domainPackage = domainPackageList.DomainPackageDetailsList?.find(
    (domainPackageEntry) => domainPackageEntry.PackageID === packageId,
  )
  if (!domainPackage) {
    return 'missing'
  }
  return domainPackage.DomainPackageStatus === DomainPackageStatus.ACTIVE ? 'active' : 'broken'
}

const dissociatePackageWithAwsEsSearchDomain = async (packageId: string) => {
  const params = {
    DomainName: environment.esDomain,
    PackageID: packageId,
  }

  logger.info('Disassociating package from AWS ES domain', params)
  const dissociatePackageCommand = new DissociatePackageCommand(params)
  const result = await awsEs.send(dissociatePackageCommand)
  await waitForPackageStatus(packageId, DomainPackageStatus.DISSOCIATING)
  return result
}

export const associatePackagesWithAwsEsSearchDomain = async (
  packages: AwsEsPackage[],
) => {
  // we have to do one at a time due to limitations in AWS API
  for (const awsEsPackage of packages) {
    const packageId = awsEsPackage.packageId
    const packageStatus = await getPackageAssociationStatus(packageId)

    if (packageStatus === 'broken') {
      logger.error('Package failed to associate correctly attempting to remove')
      await dissociatePackageWithAwsEsSearchDomain(packageId)
      logger.error('Dissociation successful, continuing')
    }

    if (packageStatus === 'missing' || packageStatus === 'broken') {
      const params = {
        DomainName: environment.esDomain,
        PackageID: packageId,
      }

      logger.info('Associating package with AWS ES domain', params)
      const associatePackageCommand = new AssociatePackageCommand(params)
      const esPackage = await awsEs.send(associatePackageCommand)

      // we have to wait for package to be ready cause AWS ES can only process one request at a time
      await waitForPackageStatus(
        esPackage.DomainPackageDetails?.PackageID ?? '',
        DomainPackageStatus.ACTIVE,
      )
    } else {
      logger.info(
        'AWS ES package already associated, skipping association of package',
        {
          packageId,
        },
      )
    }
  }

  logger.info('Successfully associated all packages with AWS ES instance')
  return true
}
