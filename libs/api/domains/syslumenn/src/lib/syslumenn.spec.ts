import { Test } from '@nestjs/testing'
import { SyslumennService } from './syslumenn.service'
import { startMocking } from '@island.is/shared/mocking'
import { requestHandlers } from './__mock-data__/requestHandlers'
import {
  VHSUCCESS,
  OPERATING_LICENSE,
  DATA_UPLOAD,
} from './__mock-data__/responses'
import { mapHomestay } from './models/homestay'
import { SYSLUMENN_AUCTION } from './__mock-data__/responses'
import { mapSyslumennAuction } from './models/syslumennAuction'
import { mapOperatingLicense } from './models/operatingLicense'
import { PersonType } from './dto/uploadData.input'
import {
  SyslumennApiConfig,
  SyslumennApiModule,
  VirkarHeimagistingar,
} from '@island.is/clients/syslumenn'

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
const APPLICATION_TYPE = 'string'

const config = {
  url: 'http://localhost',
  username: '',
  password: '',
} as SyslumennApiConfig

startMocking(requestHandlers)

describe('SyslumennService', () => {
  let service: SyslumennService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [SyslumennApiModule.register(config)],
      providers: [
        SyslumennService,
        {
          provide: 'SYSLUMENN_CLIENT_CONFIG',
          useValue: config,
        },
      ],
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
        (OPERATING_LICENSE ?? []).map(mapOperatingLicense),
      )
    })
  })

  describe('uploadData', () => {
    it('should return data upload response', async () => {
      const response = await service.uploadData(
        PERSON,
        ATTACHMENT,
        APPLICATION_TYPE,
      )
      expect(response).toStrictEqual(DATA_UPLOAD)
    })
  })
})
