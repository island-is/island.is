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
  MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
} from './__mock-data__/responses'
import {
  mapHomestay,
  mapSyslumennAuction,
  mapDataUploadResponse,
  mapPaginatedOperatingLicenses,
} from './syslumennClient.utils'
import { SYSLUMENN_AUCTION } from './__mock-data__/responses'
import { PersonType } from './syslumennClient.types'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

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
const ATTACHMENT = {
  name: 'attachment',
  content: 'content',
}

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

  describe('uploadData', () => {
    it('should return data upload response', async () => {
      const response = await service.uploadData(
        PERSON,
        ATTACHMENT,
        {
          key: 'string',
        },
        'Lögheimilisbreyting barns',
      )
      expect(response).toStrictEqual(mapDataUploadResponse(DATA_UPLOAD))
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
