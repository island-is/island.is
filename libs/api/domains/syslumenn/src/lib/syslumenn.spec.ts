import { Test } from '@nestjs/testing'
import { SyslumennService } from './syslumenn.service'
import { SyslumennModule } from './syslumenn.module'
import {
  SYSLUMENN_CLIENT_CONFIG,
  SyslumennClient,
  SyslumennClientConfig,
} from './client/syslumenn.client'
import { startMocking } from '@island.is/shared/mocking'
import { createLogger } from 'winston'
import { requestHandlers } from './__mock-data__/requestHandlers'
import { VHSUCCESS, VHFAIL, OPERATING_LICENSE, DATA_UPLOAD } from './__mock-data__/responses'
import { HttpModule } from '@nestjs/common'
import { Homestay, mapHomestay } from './models/homestay'
import { IHomestay } from './client/models/homestay'
import { SYSLUMENN_AUCTION } from './__mock-data__/responses'
import { mapSyslumennAuction } from './models/syslumennAuction'
import { mapOperatingLicense } from './models/operatingLicense'
import { PersonType } from './models/dataUpload'

const YEAR = 2021
const PERSON = [{
  name: 'string',
  ssn: 'string',
  phoneNumber: 'string',
  email: 'test@test.is',
  homeAddress: 'string',
  postalCode: 'string',
  city: 'string',
  signed: true,
  type: PersonType.Plaintiff,
}]
const ATTACHMENT = {
  name: 'attachment',
  content: 'content',
}

const config = {
  url: 'http://localhost',
  username: '',
  password: '',
} as SyslumennClientConfig

startMocking(requestHandlers)

describe('SyslumennService', () => {
  let service: SyslumennService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 10000,
        }),
      ],
      providers: [
        SyslumennService,
        SyslumennClient,
        {
          provide: SYSLUMENN_CLIENT_CONFIG,
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
    it('should return syslumenn auction', async () => {
      const response = await service.getOperatingLicenses()
      expect(response).toStrictEqual(
        (OPERATING_LICENSE ?? []).map(mapOperatingLicense),
      )
    })
  })

  describe('getOperatingLicenses', () => {
    it('should return syslumenn auction', async () => {
      const response = await service.uploadData(PERSON, ATTACHMENT, { "key": "string" })
      expect(response).toStrictEqual(
        DATA_UPLOAD
      )
    })
  })
})
