import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { ApplicationTypes } from '@island.is/application/types'
import { InheritanceReportService } from './inheritance-report.service'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { S3Service } from '@island.is/nest/aws'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

describe('InheritanceReportService', () => {
  let service: InheritanceReportService
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        InheritanceReportService,
        { provide: LOGGER_PROVIDER, useValue: mockLogger },
        { provide: SyslumennService, useValue: {} },
        { provide: NationalRegistryXRoadService, useValue: {} },
        { provide: S3Service, useValue: {} },
      ],
    }).compile()

    service = module.get(InheritanceReportService)
  })

  afterAll(async () => {
    await module.close()
  })

  describe('approveByAssignee', () => {
    it('marks the acting heir as approved in application answers', async () => {
      const heirNationalId = '0101302209'
      const otherHeirNationalId = '0101302399'

      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {
            data: [
              {
                name: 'Heir A',
                relation: 'child',
                nationalId: heirNationalId,
                initial: false,
                enabled: true,
                taxFreeInheritance: '0',
                inheritance: '0',
                taxableInheritance: '0',
                inheritanceTax: '0',
              },
              {
                name: 'Heir B',
                relation: 'child',
                nationalId: otherHeirNationalId,
                initial: false,
                enabled: true,
                taxFreeInheritance: '0',
                inheritance: '0',
                taxableInheritance: '0',
                inheritanceTax: '0',
              },
            ],
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: heirNationalId,
        scope: ['@island.is/applications:write'],
      })

      await service.approveByAssignee({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      const heirs = (application.answers as any)?.heirs?.data
      expect(heirs).toHaveLength(2)
      expect(heirs[0].approved).toBe(true)
      expect(typeof heirs[0].approvedDate).toBe('string')
      expect(heirs[1].approved).toBeUndefined()
    })

    it('throws when acting user is not in heirs list', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {
            data: [
              {
                name: 'Heir A',
                relation: 'child',
                nationalId: '0101302399',
                initial: false,
                enabled: true,
                taxFreeInheritance: '0',
                inheritance: '0',
                taxableInheritance: '0',
                inheritanceTax: '0',
              },
            ],
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101302209',
        scope: ['@island.is/applications:write'],
      })

      await expect(
        service.approveByAssignee({
          application,
          auth,
          currentUserLocale: 'is',
        } as any),
      ).rejects.toBeTruthy()
    })
  })
})


