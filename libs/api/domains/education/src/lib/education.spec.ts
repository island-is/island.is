import { Test } from '@nestjs/testing'
import { EducationService } from './education.service'
import { LoggingModule } from '@island.is/logging'
import type { Config } from './education.module'
import {
  MyFamilyMock,
  ADULT1,
  ADULT2,
  CHILD1,
  CHILD2,
} from './__mock-data__/my-family'
import {
  ISLFjolskyldan,
  NationalRegistryApi,
} from '@island.is/clients/national-registry-v1'
import { MMSApi } from '@island.is/clients/mms'
import { S3Service } from './s3.service'
import Soap from 'soap'
import * as kennitala from 'kennitala'

jest.mock('kennitala')

interface IKennitalaMock extends jest.Mock<typeof kennitala> {
  __setAge: (nationalId: string, age: number) => void
}

const kennitalaMock = <IKennitalaMock>(kennitala as unknown)

kennitalaMock.__setAge(ADULT1.Kennitala, 39)
kennitalaMock.__setAge(ADULT2.Kennitala, 42)
kennitalaMock.__setAge(CHILD1.Kennitala, 8)
kennitalaMock.__setAge(CHILD2.Kennitala, 5)

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

  describe('Test', () => {
    it('should contain unique family members for each test subject', () => {
      expect([ADULT1, CHILD2, CHILD1, ADULT2]).toStrictEqual(MyFamilyMock)
    })
  })

  describe('getFamily() for an adult', () => {
    let family: ISLFjolskyldan[]
    beforeEach(async () => {
      family = await service.getFamily(ADULT1.Kennitala)
    })

    it('should not return the spouse', async () => {
      expect(
        family.find(({ Kennitala }) => Kennitala === ADULT2.Kennitala),
      ).toBeUndefined()
    })

    it('should return yourself', async () => {
      expect(
        family.find(({ Kennitala }) => Kennitala === ADULT1.Kennitala),
      ).not.toBeUndefined()
    })

    it('should return your children', async () => {
      expect(family).toContainEqual(CHILD1)
      expect(family).toContainEqual(CHILD2)
    })

    it('should return consistantly ordered results', async () => {
      expect(family).toStrictEqual([ADULT1, CHILD1, CHILD2])
    })
  })

  describe('getFamily() for a child', () => {
    let family: ISLFjolskyldan[]
    beforeEach(async () => {
      family = await service.getFamily(CHILD1.Kennitala)
    })

    it('should not return other family members', async () => {
      expect(family).toHaveLength(1)
    })

    it('should return yourself', async () => {
      expect(
        family.find(({ Kennitala }) => Kennitala === CHILD1.Kennitala),
      ).not.toBeUndefined()
    })
  })

  describe('canView()', () => {
    it('everybody can view themselves', async () => {
      expect(service.canView(ADULT1, ADULT1)).toStrictEqual(true)
      expect(service.canView(ADULT2, ADULT2)).toStrictEqual(true)
      expect(service.canView(CHILD1, CHILD1)).toStrictEqual(true)
      expect(service.canView(CHILD2, CHILD2)).toStrictEqual(true)
    })

    it('an adult can view their children', async () => {
      expect(service.canView(ADULT1, CHILD1)).toStrictEqual(true)
      expect(service.canView(ADULT1, CHILD2)).toStrictEqual(true)
      expect(service.canView(ADULT2, CHILD1)).toStrictEqual(true)
      expect(service.canView(ADULT2, CHILD2)).toStrictEqual(true)
    })

    it('an adult can not view their spouse', async () => {
      expect(service.canView(ADULT1, ADULT2)).toStrictEqual(false)
      expect(service.canView(ADULT2, ADULT1)).toStrictEqual(false)
    })

    it('a child can not view anybody else in the family', async () => {
      expect(service.canView(CHILD1, ADULT1)).toStrictEqual(false)
      expect(service.canView(CHILD1, ADULT2)).toStrictEqual(false)
      expect(service.canView(CHILD1, CHILD2)).toStrictEqual(false)
    })
  })

  describe('isChild()', () => {
    it('recognizes children as children', async () => {
      expect(await service.isChild(CHILD1)).toStrictEqual(true)
      expect(await service.isChild(CHILD2)).toStrictEqual(true)
    })

    it("doesn't recognize adults as children", async () => {
      expect(await service.isChild(ADULT1)).toStrictEqual(false)
      expect(await service.isChild(ADULT2)).toStrictEqual(false)
    })
  })
})
