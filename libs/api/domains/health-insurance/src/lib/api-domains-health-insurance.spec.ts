import { apiDomainsHealthInsurance } from './api-domains-health-insurance'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
} from './soap'
import { BucketService } from './bucket.service'

describe('apiDomainsHealthInsurance', () => {
  it('should work', () => {
    expect(apiDomainsHealthInsurance()).toEqual('api-domains-health-insurance')
  })
})

describe('healthInsuranceTest', () => {
  let hapi: HealthInsuranceAPI
  let config: HealthInsuranceConfig = {
    baseUrl: 'http://localhost:8080',
    password: '',
    username: '',
    wsdlUrl: '',
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        HealthInsuranceAPI,
        {
          provide: HEALTH_INSURANCE_CONFIG,
          useValue: config,
        },
        BucketService,
      ],
    }).compile()
    hapi = moduleRef.get<HealthInsuranceAPI>(HealthInsuranceAPI)
  })

  // describe('isHealthInsuredDirect', () => {
  //   it('is healthInsured tjekk', async () => {
  //     const isInsured = await hapi.isHealthInsured('1111111111')
  //   })
  // })

  describe('isHealthInsuredMock', () => {
    it('is healthInsured tjekk', async () => {
      const kennitala = '1111111111'
      const res = {
        SjukratryggdurType: {
          radnumer_si: 211426334,
          sjukratryggdur: 1,
          dags: '2020-09-04T00:00:00.000Z',
          a_bidtima: 0,
        },
      }
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      const isInsured = await hapi.isHealthInsured(kennitala)
      expect(isInsured).toBe(true)
    })
  })
})
