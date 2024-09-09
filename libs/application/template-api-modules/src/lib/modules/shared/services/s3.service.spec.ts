import { Test, TestingModule } from '@nestjs/testing'
import {
    GetObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { Readable } from 'stream'
import { sdkStreamMixin } from '@smithy/util-stream'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from './s3.service'

const s3Mock = mockClient(S3Client);

describe('S3Service', () => {
    let s3Service: S3Service
  
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
              S3Service,
              {
                provide: LOGGER_PROVIDER,
                useClass: jest.fn(() => ({
                  error: () => ({})
                })),
              },
              {
                provide: S3Client,
                useValue: s3Mock
              },
            ],
          }).compile()
      
        s3Service = module.get<S3Service>(S3Service)

        s3Mock.reset()
    })
  
    it('should return a file from a bucket if one exists', async () => {
        const expectedResult = 'hello world'

        const stream = new Readable()
        stream.push(expectedResult)
        stream.push(null) // end of stream
        const sdkStream = sdkStreamMixin(stream)

        s3Mock.on(GetObjectCommand).resolvesOnce({Body: sdkStream})

        const getObjectResult = await s3Service.getFileFromBucket('bucekt', 'key')
        if(!getObjectResult)
            fail('getObjectResult was undefined')

        const contentResults = await getObjectResult.Body?.transformToString()
        if(!contentResults)
          fail('raw transform result was undefined or empty')

        expect(contentResults).toStrictEqual(expectedResult)
    })

    it('should return undefined from a bucket when an error is thrown', async () => {
      s3Mock.on(GetObjectCommand).rejectsOnce()

      const getObjectResult = await s3Service.getFileFromBucket('bucekt', 'key')

      expect(getObjectResult).toBeUndefined()
  })
})