import migrateBootstrap from './migrateAws'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3'
import {
  CreatePackageCommand,
  ElasticsearchServiceClient,
  ListPackagesForDomainCommand,
} from '@aws-sdk/client-elasticsearch-service'
import * as indexManager from '@island.is/content-search-index-manager'
import * as dictionary from './lib/dictionary'

jest.mock('@island.is/content-search-index-manager')
jest.mock('@island.is/logging')
jest.mock('./lib/dictionary')
jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/client-elasticsearch-service')

const environment = {
  s3Bucket: 'bucket',
  awsEsDomain: 'domain',
}

const mockS3Client = jest.mocked(S3Client)
const mockEsClient = jest.mocked(ElasticsearchServiceClient)

const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
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

describe('migrateBootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    environment.s3Bucket = `${environment.s3Bucket}-${Math.random()}`
    environment.awsEsDomain = `${environment.awsEsDomain}-${Math.random()}`

    jest
      .mocked(dictionary.getDictionaryFilesForVersion)
      .mockResolvedValue([
        {
          version: 'v1.0.0',
          analyzerType: 'mock',
          locale: 'en',
          file: {} as NodeJS.ReadableStream,
        },
      ])

    jest.mocked(s3Client.send).mockImplementation((command) => {
      if (command instanceof HeadObjectCommand) {
        return Promise.resolve({})
      }
      if (command instanceof PutObjectCommand) {
        return Promise.resolve({})
      }
      if (command instanceof ListObjectsV2Command) {
        return Promise.resolve({ Contents: [] })
      }
      return Promise.resolve({})
    })

    jest.mocked(esClient.send).mockImplementation((command) => {
      if (command instanceof ListPackagesForDomainCommand) {
        return Promise.resolve({
          DomainPackageDetailsList: [{ PackageID: 'mock-package' }],
        })
      }
      return Promise.resolve({})
    })
  })

  it('should successfully migrate dictionaries to AWS', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    await migrateBootstrap()

    // Verify S3 operations
    expect(jest.mocked(s3Client.send)).toHaveBeenCalledWith(
      expect.any(HeadObjectCommand),
    )
    expect(jest.mocked(s3Client.send)).toHaveBeenCalledWith(
      expect.any(PutObjectCommand),
    )

    // Verify ES operations
    expect(jest.mocked(esClient.send)).toHaveBeenCalledWith(
      expect.any(CreatePackageCommand),
    )
    expect(jest.mocked(esClient.send)).toHaveBeenCalledWith(
      expect.any(ListPackagesForDomainCommand),
    )
  }, 10000)

  it('should handle S3 upload errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    jest
      .mocked(s3Client.send)
      .mockRejectedValueOnce(new Error('S3 upload failed'))

    await expect(migrateBootstrap()).rejects.toThrow('S3 upload failed')
  })

  it('should handle Elasticsearch package creation errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    jest
      .mocked(esClient.send)
      .mockRejectedValueOnce(new Error('Failed to create package'))

    await expect(migrateBootstrap()).rejects.toThrow('Failed to create package')
  })

  it('should skip upload if S3 file already exists', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    jest.mocked(s3Client.send).mockImplementation((command) => {
      if (command instanceof HeadObjectCommand) {
        return Promise.resolve({ ContentLength: 'Test content'.length })
      }
      return Promise.resolve({})
    })

    await migrateBootstrap()

    expect(jest.mocked(s3Client.send)).toHaveBeenCalledWith(
      expect.any(HeadObjectCommand),
    )
    expect(jest.mocked(s3Client.send)).not.toHaveBeenCalledWith(
      expect.any(PutObjectCommand),
    )
  })
})
