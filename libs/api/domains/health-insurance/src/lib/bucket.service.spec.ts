import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { apiDomainsHealthInsurance } from './api-domains-health-insurance'
import { BucketService } from './bucket.service'
import { Test } from '@nestjs/testing'

// describe('apiDomainsHealthInsurance', () => {
//   it('should work', () => {
//     expect(apiDomainsHealthInsurance()).toEqual('api-domains-health-insurance')
//   })
// })

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

  describe('getNumberOfFiles', () => {
    it('get number of files from bucket', async () => {
      const res = await bucketService.getNumberOfFiles()
      expect(typeof res).toBe('number')
    })
  })
})
