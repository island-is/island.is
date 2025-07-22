import { Test, TestingModule } from '@nestjs/testing'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { Readable } from 'stream'
import { sdkStreamMixin } from '@smithy/util-stream'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service, EncodingString } from './s3.service'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Logger } from '@nestjs/common'

jest.mock('@aws-sdk/s3-request-presigner')
const s3Mock = mockClient(S3Client)

describe('S3Service', () => {
  let s3Service: S3Service
  let logger: Logger

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: S3Client,
          useValue: s3Mock,
        },
      ],
    }).compile()

    s3Service = module.get<S3Service>(S3Service)
    logger = module.get<Logger>(LOGGER_PROVIDER)

    s3Mock.reset()
  })

  it('should return a file from a bucket if one exists', async () => {
    const expectedResult = 'hello world'

    mockGetObjectCommandWithBodyOnce(expectedResult)

    const getObjectResult = await s3Service.getFile({ bucket: 'x', key: 'y' })
    expect(getObjectResult).toBeDefined()

    const contentResults = await getObjectResult?.Body?.transformToString()
    expect(contentResults).toBeDefined()

    expect(contentResults).toStrictEqual(expectedResult)
  })

  it('should return undefined from a bucket when an error is thrown', async () => {
    s3Mock.on(GetObjectCommand).rejectsOnce()

    const getObjectResult = await s3Service.getFile({ bucket: 'x', key: 'y' })

    expect(getObjectResult).toBeUndefined()
  })

  it.each([undefined, 'base64', 'binary'])(
    'should return correct file content and encoding',
    async (encoding: string | undefined) => {
      const startingString = 'Hello ÁáÉéÚúÍíÓóÐðÞþ'
      const expectedResult = Buffer.from(startingString).toString(
        encoding as BufferEncoding,
      )

      mockGetObjectCommandWithBodyOnce(startingString)
      const result = await s3Service.getFileContent(
        { bucket: 'abc', key: 'def' },
        encoding as EncodingString,
      )

      expect(result).toEqual(expectedResult)
    },
  )

  it('should return a valid presigned url', async () => {
    const expectedResult = 'https://website.com'
    const getSignedUrlMock = getSignedUrl as jest.MockedFunction<
      typeof getSignedUrl
    >
    getSignedUrlMock.mockResolvedValue(expectedResult)

    const result = await s3Service.getPresignedUrl(
      { bucket: 'x', key: 'y' },
      100,
    )

    expect(result).toEqual(expectedResult)
  })

  it('should return true if the object exists in s3', async () => {
    const metadata = { httpStatusCode: 200 }
    s3Mock.on(HeadObjectCommand).resolvesOnce({ $metadata: metadata })

    const result = await s3Service.fileExists({ bucket: 'x', key: 'y' })

    expect(result).toEqual(true)
  })

  it.each([404, 403])(
    'should return false if the object doesnt exist in s3',
    async (code) => {
      const metadata = { httpStatusCode: code }
      s3Mock.on(HeadObjectCommand).rejectsOnce({ $metadata: metadata })

      const result = await s3Service.fileExists({ bucket: 'x', key: 'y' })

      expect(logger.error).toHaveBeenCalledTimes(0)
      expect(result).toEqual(false)
    },
  )

  it.each([500, 400])(
    'should return false and log error if an unexpected error occurs in s3',
    async (code) => {
      const metadata = { httpStatusCode: code }
      s3Mock.on(HeadObjectCommand).rejectsOnce({ $metadata: metadata })

      const result = await s3Service.fileExists({ bucket: 'x', key: 'y' })

      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred while checking if file: y exists in S3 bucket: x',
        Error(),
      )

      expect(result).toEqual(false)
    },
  )

  it('should return false if the object doesnt exist in s3 and the error as no metadata', async () => {
    s3Mock.on(HeadObjectCommand).resolvesOnce({})

    const result = await s3Service.fileExists({ bucket: 'x', key: 'y' })

    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred while checking if file: y exists in S3 bucket: x',
      TypeError(
        "Cannot read properties of undefined (reading 'httpStatusCode')",
      ),
    )

    expect(result).toBe(false)
  })

  it.each([200, 204])(
    'should resolve without error if file was deleted in s3',
    async (code) => {
      const metadata = { httpStatusCode: code }
      s3Mock.on(DeleteObjectCommand).resolvesOnce({ $metadata: metadata })

      const result = await s3Service.deleteObject({ bucket: 'x', key: 'y' })

      expect(result).toBe(true)
      expect(logger.error).toHaveBeenCalledTimes(0)
    },
  )

  it.each([201, 301, 404, 500])(
    'should log error if file was not deleted in s3',
    async (code) => {
      const metadata = { httpStatusCode: code }
      s3Mock.on(DeleteObjectCommand).resolvesOnce({ $metadata: metadata })

      const result = await s3Service.deleteObject({ bucket: 'x', key: 'y' })

      expect(result).toBe(false)

      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred while deleting file: y from S3 bucket: x',
        Error('Unexpected http response when deleting object from S3'),
      )
    },
  )

  it('should handle DeleteObjectCommand throwing an error', async () => {
    s3Mock.on(DeleteObjectCommand).rejects(new Error('Network error'))

    const result = await s3Service.deleteObject({ bucket: 'x', key: 'y' })

    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred while deleting file: y from S3 bucket: x',
      expect.any(Error),
    )
  })

  it('should return correct bucket and key strings', async () => {
    const bucketKeyPair = { bucket: 'abc', key: 'def' }
    const fileUri = 'https://abc.s3.amazonaws.com/def'

    const resultFromPair = s3Service.getBucketKey(bucketKeyPair)
    const resultFromFilename = s3Service.getBucketKey(fileUri)

    expect(resultFromPair.bucket).toEqual(bucketKeyPair.bucket)
    expect(resultFromPair.key).toEqual(bucketKeyPair.key)

    expect(resultFromFilename.bucket).toEqual(bucketKeyPair.bucket)
    expect(resultFromFilename.key).toEqual(bucketKeyPair.key)
  })
})

const mockGetObjectCommandWithBodyOnce = (body: string) => {
  const stream = new Readable()
  stream.push(body)
  stream.push(null) // end of stream
  const sdkStream = sdkStreamMixin(stream)

  s3Mock.on(GetObjectCommand).resolvesOnce({ Body: sdkStream })
}
