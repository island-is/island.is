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
  mapAlcoholLicence,
  mapTemporaryEventLicence,
} from './syslumennClient.utils'
import {
  SYSLUMENN_AUCTION,
  REAL_ESTATE_AGENTS,
  LAWYERS,
  ALCOHOL_LICENCES,
} from './__mock-data__/responses'
import { PersonType } from './syslumennClient.types'
import { SyslumennClientModule } from '../lib/syslumennClient.module'

import { defineConfig, ConfigModule } from '@island.is/nest/config'

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
const INVALID_ESTATE_APPLICANT = '0101303019'

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
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
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

  /**
   * TODO: Make sure that this test runs successfully after Syslumenn API licenseResponsible field has been fixed.
  describe('getTemporaryEventLicences', () => {
    it('should return temporary event licences', async () => {
      const response = await service.getTemporaryEventLicences()
      expect(response).toStrictEqual(

        (TEMPORARY_EVENT_LICENCES ?? []).map(mapTemporaryEventLicence),
      )
    })
  })
  */

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
      const response = await service.getMortgageCertificate(
        MOCK_PROPERTY_NUMBER_OK,
      )

      expect(response.contentBase64).toBeTruthy()
    })

    it('content should be a specific error message', async () => {
      const response = await service.getMortgageCertificate(
        MOCK_PROPERTY_NUMBER_NO_KMARKING,
      )

      expect(response.contentBase64).toStrictEqual(
        MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
      )
    })

    it('should throw an error', async () => {
      return await service
        .getMortgageCertificate(MOCK_PROPERTY_NUMBER_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('validateMortgageCertificate', () => {
    it('hasKMarking should be true', async () => {
      const res = await service.validateMortgageCertificate(
        MOCK_PROPERTY_NUMBER_OK,
        undefined,
      )
      expect(res.hasKMarking).toStrictEqual(true)
    })

    it('hasKMarking should be false', async () => {
      const res = await service.validateMortgageCertificate(
        MOCK_PROPERTY_NUMBER_NO_KMARKING,
        undefined,
      )
      expect(res.hasKMarking).toStrictEqual(false)
    })

    it('exists should be false', async () => {
      const res = await service.validateMortgageCertificate(
        MOCK_PROPERTY_NUMBER_NOT_EXISTS,
        undefined,
      )
      expect(res.exists).toStrictEqual(false)
    })
  })
})
