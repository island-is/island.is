import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { BucketService } from './bucket.service'

describe('bucketService', () => {
  let bucketService: BucketService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        BucketService,
      ],
    }).compile()
    bucketService = moduleRef.get<BucketService>(BucketService)
  })

  // https://stackoverflow.com/questions/62829590/cannot-spyon-on-a-primitive-value-undefined-given-in-nestjs
  // https://jestjs.io/docs/en/tutorial-async

  describe('getNumberOfFiles', () => {
    it('get number of files from bucket', async () => {
      const res = await bucketService.getNumberOfFiles()
      expect(typeof res).toBe('number')
    })
  })
})
