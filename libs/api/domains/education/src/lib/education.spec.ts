import { Test } from '@nestjs/testing'
import { EducationService } from './education.service'
import { LoggingModule } from '@island.is/logging'
import type { Config } from './education.module'
import { MyFamilyMock } from './mock-data/my-family'
import {
  ISLFjolskyldan,
  NationalRegistryApi,
} from '@island.is/clients/national-registry-v1'
import { MMSApi } from '@island.is/clients/mms'
import { S3Service } from './s3.service'
import Soap from 'soap'

const config = {
  fileDownloadBucket: '',
  xroad: { baseUrl: '', clientId: '', services: { license: '', grade: '' } },
} as Config

describe('EducationService', () => {
  let service: EducationService
  let nationalRegistryService: NationalRegistryApi

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        S3Service,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            new NationalRegistryApi({} as Soap.Client, 'xx', 'yy'),
        },
        {
          provide: MMSApi,
          useFactory: async () => new MMSApi(config.xroad),
        },
        EducationService,
        { provide: 'CONFIG', useValue: config },
      ],
    }).compile()

    nationalRegistryService = module.get(NationalRegistryApi)

    jest
      .spyOn(nationalRegistryService, 'getMyFamily')
      .mockImplementation(async () => MyFamilyMock as ISLFjolskyldan[])

    service = module.get(EducationService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('MyFamily for an adult', () => {
    let family: ISLFjolskyldan[]
    beforeEach(async () => {
      family = await service.getFamily('0910819979')
    })

    it('should not return the spouse', async () => {
      expect(
        family.find(({ Kennitala }) => Kennitala === '1809789929'),
      ).toBeUndefined()
    })

    it('should return yourself', async () => {
      expect(
        family.find(({ Kennitala }) => Kennitala === '0910819979'),
      ).not.toBeUndefined()
    })

    it('should return consistantly ordered results', async () => {
      expect(family.map(({ Kennitala }) => Kennitala)).toStrictEqual([
        '0910819979',
        '2407134110',
        '3108168330',
      ])
    })
  })

  describe('MyFamily for a child', () => {
    let family: ISLFjolskyldan[]
    beforeEach(async () => {
      family = await service.getFamily('2407134110')
    })

    it('should not return other family members', async () => {
      expect(family).toHaveLength(1)
    })

    it('should return yourself', async () => {
      expect(
        family.find(({ Kennitala }) => Kennitala === '2407134110'),
      ).not.toBeUndefined()
    })
  })
})
