import { apiDomainsHealthInsurance } from './api-domains-health-insurance'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
} from './soap'
import { BucketService } from './bucket.service'
import { VistaSkjalInput } from '@island.is/health-insurance'
import { VistaSkjalModel } from './graphql/models'

describe('apiDomainsHealthInsurance', () => {
  it('should work', () => {
    expect(apiDomainsHealthInsurance()).toEqual('api-domains-health-insurance')
  })
})

describe('healthInsuranceTest', () => {
  let hapi: HealthInsuranceAPI
  const config: HealthInsuranceConfig = {
    baseUrl: 'http://localhost:8080',
    password: '',
    username: '',
    wsdlUrl: '',
    clientID: '',
    xroadID: '',
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

  describe('isHealthInsuredMock', () => {
    const kennitala = '0123456789'
    it('is healthInsured tjekk', async () => {
      /*eslint-disable */
      const res = {
        SjukratryggdurType: {
          radnumer_si: 211426334,
          sjukratryggdur: 1,
          dags: '2020-09-04T00:00:00.000Z',
          a_bidtima: 0,
        },
      }
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      const isInsured = await hapi.isHealthInsured(kennitala)
      expect(isInsured).toBe(true)
    })

    it('should normalize thrown errors', async () => {
      jest.spyOn(hapi, 'xroadCall').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await hapi.isHealthInsured(kennitala)
      }).rejects.toThrowError('Some unexpected error')
    })

    it('is healthInsured return false', async () => {
      /*eslint-disable */
      const res = {
        SjukratryggdurType: {
          radnumer_si: 211426334,
          sjukratryggdur: 0,
          dags: '2020-09-04T00:00:00.000Z',
          a_bidtima: 0,
        },
      }
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(await hapi.isHealthInsured(kennitala)).toBe(false)
    })
  })

  describe('getPendingApplicationMock', () => {
    const kennitala = '0123456789'
    it('pending application tjekk', async () => {
      /*eslint-disable */
      const res = {
        FaUmsoknSjukratryggingType: {
          umsoknir: [
            {
              skjalanumer: 32942472,
              stada: 2,
            },
            {
              skjalanumer: 2424242,
              stada: 1,
            },
            {
              skjalanumer: 329424472,
              stada: 2,
            },
          ],
        },
      }
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(await hapi.getPendingApplication(kennitala)).toStrictEqual([
        32942472,
        329424472,
      ])
    })

    it('should normalize thrown errors', async () => {
      jest.spyOn(hapi, 'xroadCall').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await hapi.getPendingApplication(kennitala)
      }).rejects.toThrowError('Some unexpected error')
    })

    it('pending application return empty array', async () => {
      /*eslint-disable */
      const res = {
        FaUmsoknSjukratryggingType: {
          umsoknir: [
            {
              skjalanumer: 32942472,
              stada: 1,
            },
            {
              skjalanumer: 2424242,
              stada: 1,
            },
            {
              skjalanumer: 329424472,
              stada: 0,
            },
          ],
        },
      }
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(await hapi.getPendingApplication(kennitala)).toStrictEqual([])
    })
  })

  describe('applyHealthInsuranceMock', () => {
    const inputs: VistaSkjalInput = {
      applicationNumber: '123456',
      applicationDate: new Date(),
      nationalId: '0123456789',
      email: 'test@test.is',
      phoneNumber: '5551234',
      foreignNationalId: '0987654321',
      name: 'Test Testson',
      address: 'Batavegur 1',
      citizenship: 'Ísland',
      postalAddress: '101 Reykjavík',
      countryCode: 'IS',
      residenceDateFromNationalRegistry: new Date(),
      residenceDateUserThink: new Date(),
      userStatus: 'O',
      isChildrenFollowed: 1,
      previousCountry: 'Viet Nam',
      previousCountryCode: 'VN',
      previousIssuingInstitution: 'The gioi',
      isHealthInsuredInPreviousCountry: 0,
      hasHealthInsuranceRightInPreviousCountry: 0,
    }
    const appNumber = 570
    const kennitala = '0123456789'
    it('apply Health Insurance application tjekk', async () => {
      /*eslint-disable */
      const res = {
        VistaSkjalType: {
          radnumer_si: 211426334,
          tokst: 1,
          skjalanumer_si: 841641,
        },
      }
      const vistaskjal = new VistaSkjalModel()
      vistaskjal.isSucceeded = true
      vistaskjal.caseId = 841641
      vistaskjal.comment = ''
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(
        await hapi.applyInsurance(appNumber, inputs, kennitala),
      ).toStrictEqual(vistaskjal)
    })
    it('apply Health Insurance application return true with comment', async () => {
      /*eslint-disable */
      const res = {
        VistaSkjalType: {
          radnumer_si: 211426334,
          tokst: 2,
          skjalanumer_si: 841641,
          villulysing: 'vantar gogn',
        },
      }
      const vistaskjal = new VistaSkjalModel()
      vistaskjal.isSucceeded = true
      vistaskjal.caseId = 841641
      vistaskjal.comment = 'vantar gogn'
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(
        await hapi.applyInsurance(appNumber, inputs, kennitala),
      ).toStrictEqual(vistaskjal)
    })

    it('should normalize thrown errors', async () => {
      jest.spyOn(hapi, 'xroadCall').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await hapi.applyInsurance(570, inputs, kennitala)
      }).rejects.toThrowError('Some unexpected error')
    })

    it('apply Health Insurance application return false', async () => {
      /*eslint-disable */
      const res = {
        VistaSkjalType: {
          radnumer_si: 211426334,
          tokst: 0,
          villulysing: 'error',
          villulisti: [
            {
              linunumer: 46,
              villa: 'something unexpected',
              tegundvillu: 'tegund villu',
              villulysinginnri: 'something unexpected',
            },
          ],
        },
      }
      const vistaskjal = new VistaSkjalModel()
      vistaskjal.isSucceeded = false
      vistaskjal.comment = 'something unexpected'
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(
        await hapi.applyInsurance(appNumber, inputs, kennitala),
      ).toStrictEqual(vistaskjal)
    })

    it('apply Health Insurance application return false', async () => {
      /*eslint-disable */
      const res = {
        VistaSkjalType: {
          radnumer_si: 211426334,
          tokst: 0,
          villulysing: 'something unexpected',
        },
      }
      const vistaskjal = new VistaSkjalModel()
      vistaskjal.isSucceeded = false
      vistaskjal.comment = 'something unexpected'
      /*eslint-enable */
      jest
        .spyOn(hapi, 'xroadCall')
        .mockImplementation(() => Promise.resolve(res))
      expect(
        await hapi.applyInsurance(appNumber, inputs, kennitala),
      ).toStrictEqual(vistaskjal)
    })
  })
})
