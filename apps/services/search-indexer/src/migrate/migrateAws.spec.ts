import migrateBootstrap from './migrateAws'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import {
  CreatePackageCommand,
  ElasticsearchServiceClient,
  ListPackagesForDomainCommand,
  DescribePackagesCommand,
} from '@aws-sdk/client-elasticsearch-service'
import * as indexManager from '@island.is/content-search-index-manager'
import * as dictionary from './lib/dictionary'
import { Readable } from 'stream'

jest.mock('@island.is/content-search-index-manager')
jest.mock('@island.is/logging')
jest.mock('./lib/dictionary')
jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/client-elasticsearch-service')

const environment = {
  s3Bucket: 'bucket',
  awsEsDomain: 'domain',
}

const mockS3Send = jest.fn()
const mockEsSend = jest.fn()

jest.mocked(S3Client).mockImplementation(
  () =>
    ({
      send: mockS3Send,
    } as unknown as S3Client),
)

jest.mocked(ElasticsearchServiceClient).mockImplementation(
  () =>
    ({
      send: mockEsSend,
    } as unknown as ElasticsearchServiceClient),
)

describe('migrateBootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    environment.s3Bucket = `${environment.s3Bucket}-${Math.random()}`
    environment.awsEsDomain = `${environment.awsEsDomain}-${Math.random()}`

    jest.mocked(dictionary.getDictionaryFilesForVersion).mockResolvedValue([
      {
        version: 'v1.0.0',
        analyzerType: 'mock',
        locale: 'en',
        file: new Readable({
          read() {
            this.push('test data')
            this.push(null)
          },
        }),
      },
    ])

    mockS3Send.mockImplementation((command) => {
      if (command instanceof HeadObjectCommand) {
        return Promise.resolve({})
      }
      if (command instanceof PutObjectCommand) {
        return Promise.resolve({})
      }
      if (command instanceof ListObjectsV2Command) {
        return Promise.resolve({ Contents: [] })
      }
      throw new Error(`Unknown command: ${command.constructor.name}`)
    })

    mockEsSend.mockImplementation((command) => {
      if (command instanceof ListPackagesForDomainCommand) {
        return Promise.resolve({
          DomainPackageDetailsList: [{ PackageID: 'mock-package' }],
        })
      }
      if (command instanceof CreatePackageCommand) {
        return Promise.resolve({
          PackageDetails: { PackageID: 'new-mock-package' },
        })
      }
      if (command instanceof DescribePackagesCommand) {
        return Promise.resolve({ PackageDetailsList: [] })
      }
      throw new Error(`Unknown command: ${command.constructor.name}`)
    })
  })

  it('should successfully migrate dictionaries to AWS', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    await migrateBootstrap()

    expect(mockS3Send).toHaveBeenCalledWith(expect.any(HeadObjectCommand))
    expect(mockS3Send).toHaveBeenCalledWith(expect.any(PutObjectCommand))
    expect(mockEsSend).toHaveBeenCalledWith(expect.any(CreatePackageCommand))
    expect(mockEsSend).toHaveBeenCalledWith(
      expect.any(ListPackagesForDomainCommand),
    )
  })

  it('should handle S3 upload errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    mockS3Send.mockRejectedValueOnce(new Error('S3 upload failed') as never)

    await expect(migrateBootstrap()).rejects.toThrow('S3 upload failed')
  })

  it('should handle Elasticsearch package creation errors', async () => {
    jest.mocked(indexManager.getDictionaryVersion).mockReturnValue('v1.0.0')
    mockEsSend.mockRejectedValueOnce(
      new Error('Failed to create package') as never,
    )

    await expect(migrateBootstrap()).rejects.toThrow('Failed to create package')
  })

  it('should skip upload if S3 file already exists', async () => {
    const mockDictionaryVersion = 'v1.0.0'
    jest
      .mocked(indexManager.getDictionaryVersion)
      .mockReturnValue(mockDictionaryVersion)

    mockS3Send.mockImplementation((command) => {
      if (command instanceof HeadObjectCommand) {
        return Promise.resolve({ ContentLength: 'Test content'.length })
      }
      return Promise.resolve({})
    })

    await migrateBootstrap()

    expect(mockS3Send).toHaveBeenCalledWith(expect.any(HeadObjectCommand))
    expect(mockS3Send).not.toHaveBeenCalledWith(expect.any(PutObjectCommand))
  })
})
