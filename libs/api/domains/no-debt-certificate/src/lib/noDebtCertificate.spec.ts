//TODOx cleanup

import { Test } from '@nestjs/testing'
import { NoDebtCertificateService } from './noDebtCertificate.service'
// import { NoDebtCertificateApiModule } from '@island.is/clients/no-debt-certificate'
import {
  MOCK_NATIONAL_ID,
  // MOCK_NATIONAL_ID_NOT_EXISTS,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { createLogger } from 'winston'

startMocking(requestHandlers)

describe('NoDebtCertificateService', () => {
  let service: NoDebtCertificateService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // imports: [
      //   NoDebtCertificateApiModule.register({
      //     xroadBaseUrl: 'http://localhost',
      //     xroadClientId: '',
      //     xroadPath: 'v2',
      //     fetchOptions: {
      //       logger: createLogger({
      //         silent: true,
      //       }),
      //     },
      //   }),
      // ],
      providers: [
        NoDebtCertificateService,
        { provide: 'CONFIG', useValue: {} },
      ],
    }).compile()

    service = module.get(NoDebtCertificateService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getNoDebtCertificate', () => {
    it('should return a result', async () => {
      const response = await service.getNoDebtCertificate(MOCK_NATIONAL_ID)

      expect(response.contentBase64).toBeTruthy()
    })

    // it('should throw an error', async () => {
    //   return await service
    //     .getNoDebtCertificate(MOCK_NATIONAL_ID_NOT_EXISTS)
    //     .catch((e) => {
    //       expect(e).toBeTruthy()
    //       expect.assertions(1)
    //     })
    // })
  })

  describe('validateNoDebtCertificate', () => {
    it('should not throw an error', async () => {
      expect(async () => {
        await service.validateNoDebtCertificate(MOCK_NATIONAL_ID)
      }).not.toThrowError()
    })

    // it('should throw an error', async () => {
    //   return await service
    //     .validateNoDebtCertificate(MOCK_NATIONAL_ID_NOT_EXISTS)
    //     .catch((e) => {
    //       expect(e).toBeTruthy()
    //       expect.assertions(1)
    //     })
    // })
  })
})
