import { healthInsurance } from './health-insurance'
import type { Logger } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
} from './soap'
import { VistaSkjalInput } from './types'
import { VistaSkjalModel } from './graphql/models'
import { BucketService } from './bucket/bucket.service'

describe('healthInsurance', () => {
  it('should work', () => {
    expect(healthInsurance()).toEqual('health-insurance')
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
      expect(await hapi.applyInsurance(appNumber, [], inputs)).toStrictEqual(
        vistaskjal,
      )
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
      expect(await hapi.applyInsurance(appNumber, [], inputs)).toStrictEqual(
        vistaskjal,
      )
    })

    it('should normalize thrown errors', async () => {
      jest.spyOn(hapi, 'xroadCall').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await hapi.applyInsurance(570, [], inputs)
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
      expect(await hapi.applyInsurance(appNumber, [], inputs)).toStrictEqual(
        vistaskjal,
      )
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
      expect(await hapi.applyInsurance(appNumber, [], inputs)).toStrictEqual(
        vistaskjal,
      )
    })
  })
})
