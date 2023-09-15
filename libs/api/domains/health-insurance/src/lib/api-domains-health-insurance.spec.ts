import { apiDomainsHealthInsurance } from './api-domains-health-insurance'
import { Test } from '@nestjs/testing'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HealthInsuranceV2Client,
  HealthInsuranceV2Options,
} from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'

describe('apiDomainsHealthInsurance', () => {
  it('should work', () => {
    expect(apiDomainsHealthInsurance()).toEqual('api-domains-health-insurance')
  })
})

describe('healthInsuranceTest', () => {
  interface HealthInsuranceOptions {
    clientV2Config: HealthInsuranceV2Options
  }
  const options: HealthInsuranceOptions = {
    clientV2Config: {
      xRoadBaseUrl: 'http://localhost:8080',
      password: '',
      username: '',
      xRoadClientId: '',
      xRoadProviderId: '',
    },
  }
  let service: HealthInsuranceService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthInsuranceV2Client.register(options.clientV2Config)],
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
      }).rejects.toThrowError('Some unexpected error')
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
