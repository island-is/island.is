import { apiDomainsHealthInsurance } from './api-domains-health-insurance'
// import { BucketService } from './bucket.service'
// import { Test } from '@nestjs/testing'
// import type { Logger } from '@island.is/logging'

describe('apiDomainsHealthInsurance', () => {
  it('should work', () => {
    expect(apiDomainsHealthInsurance()).toEqual('api-domains-health-insurance')
  })
})

// describe('bucketService', () => {
//   let bucketService: BucketService

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         {
//           provide: LOGGER_PROVIDER,
//           useValue: logger,
//         },
//         BucketService,
//       ],
//     }).compile()
//     bucketService = moduleRef.get<BucketService>(BucketService)
//   })

// describe('getNumberOfFiles', () => {
//   it('get number of files from bucket', async () => {
//     const res = await bucketService.getNumberOfFiles()
//     expect(typeof res).toBe('number')
//   })
// })

// describe('getFileFromUrl', () => {
//   it('get file using url as input', async () => {
//     const res = await bucketService.getFileFromUrl(
//       'https://dev-island-is-sjukra.s3-eu-west-1.amazonaws.com/smasaga2.txt',
//     )
//     let resp = res.Body?.toString('utf8')
//     expect(typeof resp).toBe('string')
//   })
// })
// })
