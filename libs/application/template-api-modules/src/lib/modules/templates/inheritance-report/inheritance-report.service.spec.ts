import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { ApplicationTypes } from '@island.is/application/types'
import { InheritanceReportService } from './inheritance-report.service'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'
import { S3Service } from '@island.is/nest/aws'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

const mockSyslumennService = {
  getEstateRelations: jest.fn(),
  getEstateInfoForInheritanceReport: jest.fn(),
  getInheritanceTax: jest.fn(),
  uploadData: jest.fn(),
  getInheritanceReportSignatories: jest.fn(),
}

describe('InheritanceReportService', () => {
  let service: InheritanceReportService
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        InheritanceReportService,
        { provide: LOGGER_PROVIDER, useValue: mockLogger },
        { provide: SyslumennService, useValue: mockSyslumennService },
        { provide: NationalRegistryV3Service, useValue: {} },
        { provide: S3Service, useValue: {} },
      ],
    }).compile()

    service = module.get(InheritanceReportService)
  })

  afterAll(async () => {
    await module.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
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
    const createApplicationWithEstate = (
      estateInfoSelection: string,
      nationalId: string,
      applicationFor = 'estateInheritance',
    ) =>
      createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          estateInfoSelection,
          applicationFor,
        },
        externalData: {
          syslumennOnEntry: {
            data: {
              inheritanceReportInfos: [
                { caseNumber: estateInfoSelection, nationalId },
              ],
            },
            date: new Date(),
            status: 'success',
          },
        },
      })

    it('returns signatories from Syslumenn API', async () => {
      const deceasedNationalId = '0101307789'
      mockSyslumennService.getInheritanceReportSignatories.mockResolvedValue([
        { name: 'Heir A', nationalId: '0101302209', signed: true },
        { name: 'Heir B', nationalId: '0101302399', signed: false },
      ])

      const application = createApplicationWithEstate(
        'CASE-001',
        deceasedNationalId,
      )
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
        signed: true,
      })
      expect(result.signatories[1]).toEqual({
        name: 'Heir B',
        nationalId: '0101302399',
        signed: false,
      })
      expect(
        mockSyslumennService.getInheritanceReportSignatories,
      ).toHaveBeenCalledWith(deceasedNationalId, 'ErfdafjarSkyrsla')
    })

    it('uses FyrirFramGreiddur estate type for prepaid inheritance', async () => {
      const deceasedNationalId = '0101307789'
      mockSyslumennService.getInheritanceReportSignatories.mockResolvedValue([])

      const application = createApplicationWithEstate(
        'CASE-001',
        deceasedNationalId,
        'prepaidInheritance',
      )
      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      await service.getSignatories({
        application,
        auth,
        currentUserLocale: 'is',
      } as any)

      expect(
        mockSyslumennService.getInheritanceReportSignatories,
      ).toHaveBeenCalledWith(deceasedNationalId, 'FyrirFramGreiddur')
    })

    it('throws when deceased national ID is not found', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        answers: {
          estateInfoSelection: 'CASE-001',
        },
        externalData: {
          syslumennOnEntry: {
            data: {
              inheritanceReportInfos: [],
            },
            date: new Date(),
            status: 'success',
          },
        },
      })

      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      await expect(
        service.getSignatories({
          application,
          auth,
          currentUserLocale: 'is',
        } as any),
      ).rejects.toBeTruthy()
    })

    it('throws when Syslumenn API call fails', async () => {
      const deceasedNationalId = '0101307789'
      mockSyslumennService.getInheritanceReportSignatories.mockRejectedValue(
        new Error('API error'),
      )

      const application = createApplicationWithEstate(
        'CASE-001',
        deceasedNationalId,
      )
      const auth = createCurrentUser({
        nationalId: '0101301234',
        scope: ['@island.is/applications:write'],
      })

      await expect(
        service.getSignatories({
          application,
          auth,
          currentUserLocale: 'is',
        } as any),
      ).rejects.toBeTruthy()
    })
  })
})


