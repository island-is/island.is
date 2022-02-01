import { Test } from '@nestjs/testing'
import { MortgageCertificateService } from './mortgageCertificate.service'
import { MortgageCertificateApiModule } from '@island.is/clients/mortgage-certificate'
import {
  MOCK_NATIONAL_ID,
  MOCK_NATIONAL_ID_NOT_EXISTS,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { createLogger } from 'winston'

startMocking(requestHandlers)

describe('MortgageCertificateService', () => {
  let service: MortgageCertificateService

  //TODOx
  /*beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MortgageCertificateApiModule.register({
          xroadBaseUrl: 'http://localhost',
          xroadClientId: '',
          xroadPath: 'v2',
          fetchOptions: {
            logger: createLogger({
              silent: true,
            }),
          },
        }),
      ],
      providers: [MortgageCertificateService, { provide: 'CONFIG', useValue: {} }],
    }).compile()

    service = module.get(MortgageCertificateService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getMortgageCertificate', () => {
    it('should return a result', async () => {
      const response = await service.getMortgageCertificate(MOCK_NATIONAL_ID)

      expect(response.contentBase64).toBeTruthy()
    })

    it('should throw an error', async () => {
      return await service
        .getMortgageCertificate(MOCK_NATIONAL_ID_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('validateMortgageCertificate', () => {
    it('should not throw an error', async () => {
      expect(async () => {
        await service.validateMortgageCertificate(MOCK_NATIONAL_ID)
      }).not.toThrowError()
    })

    it('should throw an error', async () => {
      return await service
        .validateMortgageCertificate(MOCK_NATIONAL_ID_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })*/
})
