import { Test } from '@nestjs/testing'
import { EducationService } from './education.service'
import { LoggingModule } from '@island.is/logging'
import type { Config } from './education.module'
import {
  ADULT1,
  CHILD_STUDENT1,
  CHILD_STUDENT2,
  CHILD1,
  CHILD2,
  MyChildrenMock,
  MyParentsMock,
  PARENT1,
  PARENT2,
  ADULT_STUDENT1,
} from './__mock-data__/my-family'
import { MMSApi } from '@island.is/clients/mms'
import {
  NationalRegistryV3ClientConfig,
  NationalRegistryV3ClientModule,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import { Student } from './education.type'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { AwsModule } from '@island.is/nest/aws'

const config = {
  fileDownloadBucket: '',
  xroad: { baseUrl: '', clientId: '', services: { license: '', grade: '' } },
} as Config

describe('EducationService', () => {
  let service: EducationService
  let nationalRegistryService: NationalRegistryV3ClientService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        NationalRegistryV3ClientModule,
        AwsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryV3ClientConfig],
        }),
      ],
      providers: [
        {
          provide: MMSApi,
          useValue: new MMSApi(config.xroad),
        },
        EducationService,
        { provide: 'CONFIG', useValue: config },
      ],
    }).compile()

    nationalRegistryService = module.get(NationalRegistryV3ClientService)

    jest
      .spyOn(nationalRegistryService, 'getAllDataIndividual')
      .mockImplementation(async (nationalId: string) =>
        nationalId === 'a1' ? MyChildrenMock : MyParentsMock,
      )

    service = module.get(EducationService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('Test', () => {
    it('should contain unique family members for each parent subject', () => {
      expect([CHILD2, CHILD1]).toStrictEqual(MyChildrenMock.logforeldrar?.born)
    })
    it('should contain unique family members for each child subject', () => {
      expect([PARENT1, PARENT2]).toStrictEqual(
        MyParentsMock.logforeldrar?.logForeldrar,
      )
    })
  })

  describe('getFamily() for an adult', () => {
    let family: Array<Student>
    beforeEach(async () => {
      family = await service.getFamily(ADULT1.kennitala ?? '')
    })

    it('should return yourself', async () => {
      expect(
        family.find(({ nationalId }) => nationalId === ADULT1.kennitala),
      ).not.toBeUndefined()
    })

    it('should return your children', async () => {
      expect(family).toContainEqual(CHILD_STUDENT1)
      expect(family).toContainEqual(CHILD_STUDENT2)
    })

    it('should return consistantly ordered results', async () => {
      expect(family).toStrictEqual([
        ADULT_STUDENT1,
        CHILD_STUDENT1,
        CHILD_STUDENT2,
      ])
    })
  })

  describe('getFamily() for a child', () => {
    let family: Array<Student>
    beforeEach(async () => {
      family = await service.getFamily(CHILD1.barnKennitala ?? '')
    })

    it('should not return other family members', async () => {
      expect(family).toHaveLength(1)
    })

    it('should return yourself', async () => {
      expect(
        family.find(({ nationalId }) => nationalId === CHILD1.barnKennitala),
      ).not.toBeUndefined()
    })
  })
})
