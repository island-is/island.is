import { Test } from '@nestjs/testing'
import { SyslumennService } from './syslumennClient.service'
import { startMocking } from '@island.is/shared/mocking'
import { requestHandlers } from './__mock-data__/requestHandlers'
import {
  VHSUCCESS,
  OPERATING_LICENSE,
  OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES,
  DATA_UPLOAD,
  REAL_ESTATE_ADDRESS,
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
})
