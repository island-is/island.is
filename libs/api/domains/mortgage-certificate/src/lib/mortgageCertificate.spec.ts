import { Test } from '@nestjs/testing'
import { MortgageCertificateService } from './mortgageCertificate.service'
import {
  SyslumennService,
  SyslumennClientModule,
} from '@island.is/clients/syslumenn'
import {
  MOCK_PROPERTY_NUMBER_OK,
  MockIdentityData,
  MockUserProfileData,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import {
  defineConfig,
  ConfigModule,
  IdsClientConfig,
} from '@island.is/nest/config'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'

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
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config, IdsClientConfig],
        }),
      ],
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        MortgageCertificateService,
        SyslumennService,
      ],
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
      const response = await service.getMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_OK, propertyType: '0' },
      ])

      expect(response[0].contentBase64).toBeTruthy()
    })
  })

  describe('validateMortgageCertificate', () => {
    it('exists should be true', async () => {
      const res = await service.validateMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_OK, propertyType: '0' },
      ])
      expect(res[0].exists).toStrictEqual(true)
    })

    it('hasKMarking should be true', async () => {
      const res = await service.validateMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_OK, propertyType: '0' },
      ])
      expect(res[0].hasKMarking).toStrictEqual(true)
    })
  })

  describe('requestCorrectionOnMortgageCertificate', () => {
    it('hasSentRequest should be true', async () => {
      const res = await service.requestCorrectionOnMortgageCertificate(
        MOCK_PROPERTY_NUMBER_OK,
        MockIdentityData,
        MockUserProfileData,
      )
      expect(res.hasSentRequest).toStrictEqual(true)
    })
  })
})
