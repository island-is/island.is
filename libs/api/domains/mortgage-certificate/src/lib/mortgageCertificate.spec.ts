import { Test } from '@nestjs/testing'
import { MortgageCertificateService } from './mortgageCertificate.service'
import {
  SyslumennService,
  SyslumennClientModule,
} from '@island.is/clients/syslumenn'
import {
  MOCK_PROPERTY_NUMBER_OK,
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
        MOCK_PROPERTY_NUMBER_OK,
      )

      expect(response.contentBase64).toBeTruthy()
    })
  })

  describe('validateMortgageCertificate', () => {
    it('exists should be true', async () => {
      const res = await service.validateMortgageCertificate(
        MOCK_PROPERTY_NUMBER_OK,
        undefined,
      )
      expect(res.exists).toStrictEqual(true)
    })

    it('hasKMarking should be true', async () => {
      const res = await service.validateMortgageCertificate(
        MOCK_PROPERTY_NUMBER_OK,
        undefined,
      )
      expect(res.hasKMarking).toStrictEqual(true)
    })
  })
})
