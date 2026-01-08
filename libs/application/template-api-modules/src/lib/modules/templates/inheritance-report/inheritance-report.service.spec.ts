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

  describe('getSignatories', () => {
    it('returns signatories based on enabled heirs', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {
            data: [
              {
                name: 'Heir A',
                nationalId: '0101302209',
                enabled: true,
              },
              {
                name: 'Heir B',
                nationalId: '0101302399',
                enabled: true,
              },
            ],
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      const result = await service.getSignatories({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      expect(result.success).toBe(true)
      expect(result.signatories).toHaveLength(2)
      expect(result.signatories[0]).toEqual({
        name: 'Heir A',
        nationalId: '0101302209',
        signed: true, // Mock: first heir is signed
      })
      expect(result.signatories[1]).toEqual({
        name: 'Heir B',
        nationalId: '0101302399',
        signed: false, // Mock: rest are pending
      })
    })

    it('filters out disabled heirs', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {
            data: [
              {
                name: 'Heir A',
                nationalId: '0101302209',
                enabled: true,
              },
              {
                name: 'Heir B (disabled)',
                nationalId: '0101302399',
                enabled: false,
              },
              {
                name: 'Heir C',
                nationalId: '0101302499',
                enabled: true,
              },
            ],
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      const result = await service.getSignatories({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      expect(result.success).toBe(true)
      expect(result.signatories).toHaveLength(2)
      expect(result.signatories[0].name).toBe('Heir A')
      expect(result.signatories[1].name).toBe('Heir C')
    })

    it('returns empty array when no heirs exist', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {
            data: [],
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      const result = await service.getSignatories({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      expect(result.success).toBe(true)
      expect(result.signatories).toEqual([])
    })

    it('handles undefined heirs data', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {},
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      const result = await service.getSignatories({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      expect(result.success).toBe(true)
      expect(result.signatories).toEqual([])
    })

    it('sets first heir as signed and rest as pending (mock behavior)', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          heirs: {
            data: [
              {
                name: 'Heir A',
                nationalId: '0101302209',
                enabled: true,
              },
              {
                name: 'Heir B',
                nationalId: '0101302399',
                enabled: true,
              },
              {
                name: 'Heir C',
                nationalId: '0101302499',
                enabled: true,
              },
            ],
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      const result = await service.getSignatories({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      expect(result.success).toBe(true)
      expect(result.signatories).toHaveLength(3)
      expect(result.signatories[0].signed).toBe(true)
      expect(result.signatories[1].signed).toBe(false)
      expect(result.signatories[2].signed).toBe(false)
    })
  })
})


