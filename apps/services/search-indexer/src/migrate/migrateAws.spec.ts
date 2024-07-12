import migrateBootstrap from './migrateAws'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3'
import {
  CreatePackageCommand,
  ElasticsearchServiceClient,
  ListPackagesForDomainCommand,
} from '@aws-sdk/client-elasticsearch-service'
import * as indexManager from '@island.is/content-search-index-manager'

jest.mock('@island.is/content-search-index-manager')
jest.mock('@island.is/logging')

const environment = {
  s3Bucket: 'bucket',
  awsEsDomain: 'domain',
}

const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true, // This is important when working with LocalStack
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

const esClient = new ElasticsearchServiceClient({
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

jest.mock('@aws-sdk/client-elasticsearch-service', () => {
  const original = jest.requireActual('@aws-sdk/client-elasticsearch-service')
  return {
    ...original,
    ElasticsearchServiceClient: jest.fn().mockImplementation(() => ({
      config: {
        endpoint: jest.fn().mockImplementation(() => ({
          hostname: 'localhost',
        })),
      },
      send: jest.fn().mockImplementation((command) => {
        if (command instanceof ListPackagesForDomainCommand) {
          return Promise.resolve({
            DomainPackageDetailsList: [{ PackageID: 'mock-package' }],
          })
        }
        return Promise.resolve({})
      }),
    })),
  }
})

describe('LocalStack Configuration', () => {
  it('should have correct LocalStack environment variables', () => {
    expect(process.env.AWS_ENDPOINT).toBeDefined()
    expect(process.env.AWS_ENDPOINT).toContain('localhost')
    expect(process.env.AWS_REGION).toBeDefined()
    console.log('AWS_ENDPOINT:', process.env.AWS_ENDPOINT)
    console.log('AWS_REGION:', process.env.AWS_REGION)
  })
})

const clearBucket = async (bucket: string) => {
  // Clear S3 bucket before each test
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
  })
  const { Contents } = await s3Client.send(listCommand)
  if (Contents) {
    for (const object of Contents) {
      if (object.Key) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: environment.s3Bucket,
            Key: object.Key,
          }),
        )
      }
    }
  }
}

describe('migrateBootstrap', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    environment.s3Bucket = `${environment.s3Bucket}-${Math.random()}`
    environment.awsEsDomain = `${environment.awsEsDomain}-${Math.random()}`
    // Create S3 bucket before each test
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: environment.s3Bucket,
      }),
    )
    await clearBucket(environment.s3Bucket)

    // Reset ES packages if needed
    // This might involve deleting all packages or resetting to a known state
  })
  afterEach(async () => {
    // Delete the S3 bucket
    await clearBucket(environment.s3Bucket)
    await s3Client.send(
      new DeleteBucketCommand({ Bucket: environment.s3Bucket }),
    )
    // Reset environment variables
    environment.s3Bucket = 'bucket'
    environment.awsEsDomain = 'domain'
  })

  it('should verify that we are using the LocalStack endpoint', async () => {
    expect(process.env.AWS_ENDPOINT).toBeDefined()
    expect(process.env.AWS_ENDPOINT).toContain('localhost')

    const s3Config = s3Client.config
    const esConfig = esClient.config

    expect(await s3Config.endpoint()).toMatchObject({ hostname: 'localhost' })
    expect(await esConfig.endpoint()).toMatchObject({ hostname: 'localhost' })
  })

  it('should successfully migrate dictionaries to AWS', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    await migrateBootstrap()

    // Verify S3 upload
    const listCommand = new ListObjectsCommand({
      Bucket: environment.s3Bucket,
    })
    const { Contents } = await s3Client.send(listCommand)
    expect(Contents).toBeDefined()
    expect(Contents.length).toBeGreaterThan(0)

    // Verify ES package creation and association
    const listPackagesCommand = new ListPackagesForDomainCommand({
      DomainName: environment.awsEsDomain,
    })
    const { DomainPackageDetailsList } = await esClient.send(
      listPackagesCommand,
    )
    expect(DomainPackageDetailsList).toBeDefined()
    expect(DomainPackageDetailsList?.length).toBeGreaterThan(0)
  }, 10000)

  it('should handle Elasticsearch package creation errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')

    // Mock an error for CreatePackageCommand
    jest.mocked(esClient.send).mockImplementationOnce((command) => {
      if (command instanceof CreatePackageCommand) {
        throw new Error('Failed to create package')
      }
      throw new Error('Other error')
    })

    await expect(migrateBootstrap()).rejects.toThrow('Failed to create package')

    /// Can't verify, since localstacks doestn't support ES yet
    // Verify that no packages were created
    // const listPackagesCommand = new ListPackagesForDomainCommand({
    //   DomainName: environment.awsEsDomain,
    // })
    // const { DomainPackageDetailsList } = await esClient.send(
    //   listPackagesCommand,
    // )
    // expect(DomainPackageDetailsList?.length).toBe(0)
  })

  it('should handle S3 upload errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    const originalBucketName = environment.s3Bucket
    environment.s3Bucket = 'invalid-bucket-name'

    await migrateBootstrap()

    // Check that no files were uploaded to S3
    const listCommand = new ListObjectsV2Command({
      Bucket: originalBucketName,
    })
    const { KeyCount } = await s3Client.send(listCommand)
    expect(KeyCount).toBe(0)

    // Reset the bucket name
    environment.s3Bucket = originalBucketName
  })

  it('should handle Elasticsearch package creation errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    const originalDomainName = environment.awsEsDomain
    environment.awsEsDomain = 'invalid-domain-name'

    await migrateBootstrap()

    // Check that no packages were created
    const listPackagesCommand = new ListPackagesForDomainCommand({
      DomainName: originalDomainName,
    })
    const { DomainPackageDetailsList } = await esClient.send(
      listPackagesCommand,
    )
    expect(DomainPackageDetailsList?.length).toBe(0)

    // Reset the domain name
    environment.awsEsDomain = originalDomainName
  })

  it('should skip upload if S3 file already exists', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    // Pre-upload a file to S3
    const key = `test-file-${mockDictionaryVersion}.txt`
    await s3Client.send(
      new PutObjectCommand({
        Bucket: environment.s3Bucket,
        Key: key,
        Body: 'Test content',
      }),
    )

    // Run the migration
    await migrateBootstrap()

    // Verify that the file wasn't overwritten (you might need to adjust this check based on your actual implementation)
    const headCommand = new HeadObjectCommand({
      Bucket: environment.s3Bucket,
      Key: key,
    })
    const result = await s3Client.send(headCommand)
    expect(result.ContentLength).toBe('Test content'.length)
  })
})
