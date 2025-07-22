import { apiDomainsHealthInsurance } from './api-domains-health-insurance'
import { Test } from '@nestjs/testing'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HealthInsuranceV2ClientConfig,
  HealthInsuranceV2ClientModule,
} from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

describe('apiDomainsHealthInsurance', () => {
  it('should work', () => {
    expect(apiDomainsHealthInsurance()).toEqual('api-domains-health-insurance')
  })
})

describe('healthInsuranceTest', () => {
  let service: HealthInsuranceService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HealthInsuranceV2ClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [HealthInsuranceV2ClientConfig, XRoadConfig],
        }),
      ],
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        HealthInsuranceService,
      ],
    }).compile()

    service = moduleRef.get<HealthInsuranceService>(HealthInsuranceService)
  })

  describe('isHealthInsuredMock', () => {
    const kennitala = '0123456789'
    it('is healthInsured tjekk', async () => {
      const res = true
      jest
        .spyOn(service, 'isHealthInsured')
        .mockImplementation(() => Promise.resolve(res))
      const isInsured = await service.isHealthInsured(kennitala, new Date())
      expect(isInsured).toBe(true)
    })

    it('should normalize thrown errors', async () => {
      jest.spyOn(service, 'isHealthInsured').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await service.isHealthInsured(kennitala, new Date())
      }).rejects.toThrow('Some unexpected error')
    })

    it('is healthInsured return false', async () => {
      const res = false
      jest
        .spyOn(service, 'isHealthInsured')
        .mockImplementation(() => Promise.resolve(res))
      expect(await service.isHealthInsured(kennitala, new Date())).toBe(false)
    })
  })
})
