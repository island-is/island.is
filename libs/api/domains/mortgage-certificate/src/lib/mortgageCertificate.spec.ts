import { Test } from '@nestjs/testing'
import { MortgageCertificateService } from './mortgageCertificate.service'
import {
  SyslumennService,
  SyslumennClientModule,
} from '@island.is/clients/syslumenn'
import {
  MOCK_REAL_ESTATE_NUMBER,
  MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { defineConfig, ConfigModule } from '@island.is/nest/config'

const config = defineConfig({
  name: 'SyslumennApi',
  load: () => ({
    url: 'http://localhost',
    fetch: {
      timeout: '5000',
    },
    username: '',
    password: '',
  }),
})

startMocking(requestHandlers)

describe('MortgageCertificateService', () => {
  let service: MortgageCertificateService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        SyslumennClientModule,
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
      ],
      providers: [MortgageCertificateService, SyslumennService],
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
      const response = await service.getMortgageCertificate(
        MOCK_REAL_ESTATE_NUMBER,
      )

      expect(response.contentBase64).toBeTruthy()
    })

    it('should throw an error', async () => {
      return await service
        .getMortgageCertificate(MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('validateMortgageCertificate', () => {
    it('should not throw an error', async () => {
      expect(async () => {
        await service.validateMortgageCertificate(MOCK_REAL_ESTATE_NUMBER)
      }).not.toThrowError()
    })

    it('should throw an error', async () => {
      return await service
        .validateMortgageCertificate(MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })
})
