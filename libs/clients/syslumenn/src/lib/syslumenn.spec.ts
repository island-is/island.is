import { Test } from '@nestjs/testing'
import { SyslumennService } from './syslumennClient.service'
import { startMocking } from '@island.is/shared/mocking'
import {
  requestHandlers,
  MOCK_PROPERTY_NUMBER_OK,
  MOCK_PROPERTY_NUMBER_NO_KMARKING,
  MOCK_PROPERTY_NUMBER_NOT_EXISTS,
} from './__mock-data__/requestHandlers'
import {
  VHSUCCESS,
  OPERATING_LICENSE,
  OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES,
  DATA_UPLOAD,
  REAL_ESTATE_ADDRESS,
  MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
  ESTATE_REGISTRANT_RESPONSE,
  OPERATING_LICENSES_CSV,
  TEMPORARY_EVENT_LICENCES,
  DEPARTED_REGISTRY_PERSON_RESPONSE,
} from './__mock-data__/responses'
import {
  mapHomestay,
  mapSyslumennAuction,
  mapDataUploadResponse,
  mapPaginatedOperatingLicenses,
  mapOperatingLicensesCSV,
  mapEstateRegistrant,
  mapRealEstateAgent,
  mapLawyer,
  mapBroker,
  mapAlcoholLicence,
  mapTemporaryEventLicence,
  mapDepartedToRegistryPerson,
} from './syslumennClient.utils'
import {
  SYSLUMENN_AUCTION,
  REAL_ESTATE_AGENTS,
  LAWYERS,
  BROKERS,
  ALCOHOL_LICENCES,
} from './__mock-data__/responses'
import { PersonType } from './syslumennClient.types'
import { SyslumennClientModule } from '../lib/syslumennClient.module'

import {
  defineConfig,
  ConfigModule,
  IdsClientConfig,
} from '@island.is/nest/config'

const YEAR = 2021
const PERSON = [
  {
    name: 'string',
    ssn: 'string',
    phoneNumber: 'string',
    email: 'test@test.is',
    homeAddress: 'string',
    postalCode: 'string',
    city: 'string',
    signed: true,
    type: PersonType.Plaintiff,
  },
]
const ATTACHMENTS = [
  {
    name: 'attachment',
    content: 'content',
  },
]

const VALID_ESTATE_APPLICANT = '0101302399'
const VALID_DEPARTED_PERSON = '0101302399'

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

describe('SyslumennService', () => {
  let service: SyslumennService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        SyslumennClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config, IdsClientConfig],
        }),
      ],
      providers: [SyslumennService],
    }).compile()

    service = module.get(SyslumennService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getHomestays', () => {
    it('should return homestay when year is sent', async () => {
      const response = await service.getHomestays(YEAR)
      expect(response).toStrictEqual((VHSUCCESS ?? []).map(mapHomestay))
    })
    it('should return homestay', async () => {
      const response = await service.getHomestays()
      expect(response).toStrictEqual((VHSUCCESS ?? []).map(mapHomestay))
    })
  })

  describe('getSyslumennAuctions', () => {
    it('should return syslumenn auction', async () => {
      const response = await service.getSyslumennAuctions()
      expect(response).toStrictEqual(
        (SYSLUMENN_AUCTION ?? []).map(mapSyslumennAuction),
      )
    })
  })

  describe('getRealEstateAgents', () => {
    it('should return real estate agents', async () => {
      const response = await service.getRealEstateAgents()
      expect(response).toStrictEqual(
        (REAL_ESTATE_AGENTS ?? []).map(mapRealEstateAgent),
      )
    })
  })

  describe('getLawyers', () => {
    it('should return lawyers', async () => {
      const response = await service.getLawyers()
      expect(response).toStrictEqual((LAWYERS ?? []).map(mapLawyer))
    })
  })

  describe('getBrokers', () => {
    it('should return brokers', async () => {
      const response = await service.getBrokers()
      expect(response).toStrictEqual((BROKERS ?? []).map(mapBroker))
    })
  })

  describe('getOperatingLicenses', () => {
    it('should return operating license', async () => {
      const response = await service.getOperatingLicenses()
      expect(response).toStrictEqual(
        mapPaginatedOperatingLicenses(
          '',
          JSON.stringify(OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES),
          OPERATING_LICENSE,
        ),
      )
    })
  })

  describe('getOperatingLicensesCSV', () => {
    it('should return operating licences CSV', async () => {
      const response = await service.getOperatingLicensesCSV()
      expect(response).toStrictEqual(
        mapOperatingLicensesCSV(OPERATING_LICENSES_CSV),
      )
    })
  })

  describe('getAlcoholLicences', () => {
    it('should return alcohol licences', async () => {
      const response = await service.getAlcoholLicences()
      expect(response).toStrictEqual(
        (ALCOHOL_LICENCES ?? []).map(mapAlcoholLicence),
      )
    })
  })

  describe('getTemporaryEventLicences', () => {
    it('should return temporary event licences', async () => {
      const response = await service.getTemporaryEventLicences()
      expect(response).toStrictEqual(
        (TEMPORARY_EVENT_LICENCES ?? []).map(mapTemporaryEventLicence),
      )
    })
  })

  describe('uploadData', () => {
    it('should return data upload response', async () => {
      const response = await service.uploadData(
        PERSON,
        ATTACHMENTS,
        {
          key: 'string',
        },
        'Lögheimilisbreyting barns',
      )
      expect(response).toStrictEqual(mapDataUploadResponse(DATA_UPLOAD))
    })
  })

  describe('getEstateRegistrant', () => {
    it('should return estate registry for a valid nationalId', async () => {
      const response = await service.getEstateRegistrant(VALID_ESTATE_APPLICANT)
      expect(response).toStrictEqual(
        ESTATE_REGISTRANT_RESPONSE.map(mapEstateRegistrant),
      )
    })
  })

  describe('getRegistryPerson', () => {
    it('should return personal information from registry for a valid nationalId', async () => {
      const response = await service.getRegistryPerson(VALID_DEPARTED_PERSON)
      expect(response).toStrictEqual(
        mapDepartedToRegistryPerson(DEPARTED_REGISTRY_PERSON_RESPONSE),
      )
    })
  })

  describe('getRealEstateAddress', () => {
    it('should return address for valid realEstateId', async () => {
      const response = await service.getRealEstateAddress('012345')
      expect(response).toStrictEqual(REAL_ESTATE_ADDRESS)
    })

    it('should return error for invalid realEstateId', async () => {
      const response = await service.getRealEstateAddress('abcdefg')
      expect(response).toStrictEqual([])
    })
  })

  describe('getMortgageCertificate', () => {
    it('content should not be empty', async () => {
      const response = await service.getMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_OK, propertyType: '0' },
      ])

      expect(response[0].contentBase64).toBeTruthy()
    })

    it('content should be a specific error message', async () => {
      const response = await service.getMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_NO_KMARKING, propertyType: '0' },
      ])

      expect(response[0].contentBase64).toStrictEqual(
        MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
      )
    })

    it('should throw an error', async () => {
      return await service
        .getMortgageCertificate([
          {
            propertyNumber: MOCK_PROPERTY_NUMBER_NOT_EXISTS,
            propertyType: '0',
          },
        ])
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('validateMortgageCertificate', () => {
    it('hasKMarking should be true', async () => {
      const res = await service.validateMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_OK, propertyType: '0' },
      ])
      expect(res[0].hasKMarking).toStrictEqual(true)
    })

    it('hasKMarking should be false', async () => {
      const res = await service.validateMortgageCertificate([
        { propertyNumber: MOCK_PROPERTY_NUMBER_NO_KMARKING, propertyType: '0' },
      ])
      expect(res[0].hasKMarking).toStrictEqual(false)
    })

    it('should throw an error', async () => {
      return await service
        .validateMortgageCertificate([
          {
            propertyNumber: MOCK_PROPERTY_NUMBER_NOT_EXISTS,
            propertyType: '0',
          },
        ])
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('getAllPropertyDetails', () => {
    it('property real estate address should exist', async () => {
      const response = await service.getAllPropertyDetails('135791', '0')
      expect(response.propertyNumber).toStrictEqual('135791')
    })
  })
})
