import { migrateBootstrap } from './migrateAws'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import {
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
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

const esClient = new ElasticsearchServiceClient({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

describe('migrateBootstrap', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    // Clear S3 bucket before each test
    const listCommand = new ListObjectsV2Command({
      Bucket: environment.s3Bucket,
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
    // Reset ES packages if needed
    // This might involve deleting all packages or resetting to a known state
  })

  it('should verify that we are using the LocalStack endpoint', async () => {
    expect(process.env.AWS_ENDPOINT).toBeDefined()
    expect(process.env.AWS_ENDPOINT).toContain('localhost')

    const s3Config = (s3Client as any).config
    const esConfig = (esClient as any).config

    expect(s3Config.endpoint).toEqual(process.env.AWS_ENDPOINT)
    expect(esConfig.endpoint).toEqual(process.env.AWS_ENDPOINT)
  })

  it('should successfully migrate dictionaries to AWS', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    await migrateBootstrap()

    // Verify S3 upload
    const listCommand = new ListObjectsV2Command({
      Bucket: environment.s3Bucket,
    })
    const { Contents } = await s3Client.send(listCommand)
    expect(Contents).toBeDefined()
    expect(Contents?.length).toBeGreaterThan(0)

    // Verify ES package creation and association
    const listPackagesCommand = new ListPackagesForDomainCommand({
      DomainName: environment.awsEsDomain,
    })
    const { DomainPackageDetailsList } = await esClient.send(
      listPackagesCommand,
    )
    expect(DomainPackageDetailsList).toBeDefined()
    expect(DomainPackageDetailsList?.length).toBeGreaterThan(0)

    // Add more specific checks as needed
  })

  it('should handle S3 upload errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    // Simulate S3 error by using an invalid bucket name
    const originalBucketName = environment.s3Bucket
    environment.s3Bucket = 'invalid-bucket-name'

    await expect(migrateBootstrap()).rejects.toThrow()

    // Reset the bucket name
    environment.s3Bucket = originalBucketName
  })

  it('should handle Elasticsearch package creation errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    // Simulate ES error by using an invalid domain name
    const originalDomainName = environment.awsEsDomain
    environment.awsEsDomain = 'invalid-domain-name'

    await expect(migrateBootstrap()).rejects.toThrow()

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
