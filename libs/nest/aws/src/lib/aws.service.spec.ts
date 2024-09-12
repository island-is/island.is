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
import { AwsService, EncodingString } from './aws.service'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

jest.mock('@aws-sdk/s3-request-presigner')
const s3Mock = mockClient(S3Client)
const loggerMock = {
  error: jest.fn(),
}

describe('AwsService', () => {
  let awsService: AwsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        {
          provide: LOGGER_PROVIDER,
          useValue: loggerMock,
        },
        {
          provide: S3Client,
          useValue: s3Mock,
        },
      ],
    }).compile()

    awsService = module.get<AwsService>(AwsService)

    s3Mock.reset()
    loggerMock.error.mockClear()
  })

  it('should return a file from a bucket if one exists', async () => {
    const expectedResult = 'hello world'

    mockGetObjectCommandWithBodyOnce(expectedResult)

    const getObjectResult = await awsService.getFile({ bucket: 'x', key: 'y' })
    if (!getObjectResult) fail('getObjectResult was undefined')

    const contentResults = await getObjectResult.Body?.transformToString()
    if (!contentResults) fail('raw transform result was undefined or empty')

    expect(contentResults).toStrictEqual(expectedResult)
  })

  it('should return undefined from a bucket when an error is thrown', async () => {
    s3Mock.on(GetObjectCommand).rejectsOnce()

    const getObjectResult = await awsService.getFile({ bucket: 'x', key: 'y' })

    expect(getObjectResult).toBeUndefined()
  })

  it.each([undefined, 'base64', 'binary', 'asdasd'])(
    'should return correct file content and encoding',
    async (encoding: string | undefined) => {
      const startingString = 'Hello ÁáÉéÚúÍíÓóÐðÞþ'
      const expectedResult = Buffer.from(startingString).toString(
        encoding as BufferEncoding,
      )

      mockGetObjectCommandWithBodyOnce(startingString)
      const result = await awsService.getFileContent(
        { bucket: 'abc', key: 'def' },
        encoding as EncodingString,
      )

      expect(result).toEqual(expectedResult)
    },
  )

  it('should return a valid presigned url', async () => {
    const expectedResult = 'https://website.com'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getSignedUrlMock: jest.Mock = getSignedUrl as any
    getSignedUrlMock.mockResolvedValue(expectedResult)

    const result = await awsService.getPresignedUrl(
      { bucket: 'x', key: 'y' },
      100,
    )

    expect(result).toEqual(expectedResult)
  })

  it('should return true if the object exists in s3', async () => {
    const expectedResult = true
    const metadata = { httpStatusCode: 200 }
    s3Mock.on(HeadObjectCommand).resolvesOnce({ $metadata: metadata })

    const result = await awsService.fileExists({ bucket: 'x', key: 'y' })

    expect(result).toEqual(expectedResult)
  })

  it.each([404, 403, 500])(
    'should return false if the object doesnt exist in s3',
    async (code) => {
      const expectedResult = false
      const metadata = { httpStatusCode: code }
      s3Mock.on(HeadObjectCommand).resolvesOnce({ $metadata: metadata })

      const result = await awsService.fileExists({ bucket: 'x', key: 'y' })

      expect(result).toEqual(expectedResult)
    },
  )

  it.each([200, 204])(
    'should resolve without error if file was deleted in s3',
    async (code) => {
      const metadata = { httpStatusCode: code }
      s3Mock.on(DeleteObjectCommand).resolvesOnce({ $metadata: metadata })

      await awsService.deleteObject({ bucket: 'x', key: 'y' })

      expect(loggerMock.error).toBeCalledTimes(0)
    },
  )

  it.each([201, 301, 404, 500])(
    'should log error if file was not deleted in s3',
    async (code) => {
      const metadata = { httpStatusCode: code }
      s3Mock.on(DeleteObjectCommand).resolvesOnce({ $metadata: metadata })

      await awsService.deleteObject({ bucket: 'x', key: 'y' })

      expect(loggerMock.error).toBeCalledTimes(1)
      expect(loggerMock.error).toBeCalledWith(
        'Error occurred while deleteing file from S3',
        Error('Unexpected http response when deleting object from S3'),
      )
    },
  )

  it('should return correct bucket and key strings', async () => {
    const bucketKeyPair = { bucket: 'abc', key: 'def' }
    const fileUri = 'https://abc.s3.amazonaws.com/def'

    const resultFromPair = awsService.getBucketKey(bucketKeyPair)
    const resultFromFilename = awsService.getBucketKey(fileUri)

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
