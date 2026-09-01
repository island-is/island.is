import { Test, TestingModule } from '@nestjs/testing'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import type { FormValue } from '@island.is/application/types'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'
import { messages as salaryReportMessages } from '@island.is/application/templates/directorate-of-equality/salary-report'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { DirectorateOfEqualityService } from './directorate-of-equality.service'

// Inside the window dataSchema enforces (tomorrow through three years out),
// derived from today so the spec doesn't expire. A year out leaves enough slack
// that a runner in any timezone stays in range.
const inWindowRemedyDate = () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString().slice(0, 10)
}

const group = (overrides: FormValue = {}) => ({
  name: 'Hópur 1',
  reason: 'Skýring',
  action: 'Aðgerð',
  signatureName: 'Nafn',
  signatureRole: 'Starfsheiti',
  employeeOrdinals: [1, 2],
  ...overrides,
})

describe('DirectorateOfEqualityService', () => {
  let service: DirectorateOfEqualityService
  let editOutliers: jest.Mock
  let getActiveEqualityReport: jest.Mock
  let updateDraft: jest.Mock
  let submitDraft: jest.Mock

  beforeEach(async () => {
    editOutliers = jest.fn().mockResolvedValue({})
    getActiveEqualityReport = jest.fn().mockResolvedValue({ id: 'fresh-id' })
    updateDraft = jest.fn().mockResolvedValue({})
    submitDraft = jest.fn().mockResolvedValue({})

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectorateOfEqualityService,
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: CompanyRegistryClientService, useValue: {} },
        { provide: ApplicationApiService, useValue: {} },
        {
          provide: DirectorateOfEqualityClientService,
          useValue: {
            editOutliers,
            getActiveEqualityReport,
            updateDraft,
            submitDraft,
          },
        },
      ],
    }).compile()

    service = module.get<DirectorateOfEqualityService>(
      DirectorateOfEqualityService,
    )
  })

  describe('editOutliers', () => {
    const run = async (salaryAnalysis: FormValue) => {
      const auth = createCurrentUser()
      const application = createApplication({
        answers: { approveExternalData: true, salaryAnalysis },
      })

      await service.editOutliers({
        auth,
        application,
        currentUserLocale: 'is',
      } as Parameters<typeof service.editOutliers>[0])

      return editOutliers.mock.calls[0][2]
    }

    // DMR validates remedyDate against /^\d{4}-\d{2}-\d{2}$/ and rejects
    // anything else, so what matters is the serialised form, not the value the
    // payload holds — a `Date` would satisfy an equality check on the object
    // and still go over the wire as an ISO instant.
    it('sends the remedy date as the stored yyyy-MM-dd string', async () => {
      const remedyDate = inWindowRemedyDate()

      const body = await run({ outlierGroups: [group({ remedyDate })] })

      expect(body.groups[0].remedyDate).toBe(remedyDate)
      expect(JSON.parse(JSON.stringify(body)).groups[0].remedyDate).toBe(
        remedyDate,
      )
      expect(JSON.stringify(body)).not.toContain('T00:00:00')
    })

    // A postponed draft is the one path a blank reaches here on: it short-
    // circuits dataSchema's per-group checks. `null` on a required field is the
    // intended 400 rather than a date the applicant never committed to.
    it('sends null when the remedy date is blank', async () => {
      const body = await run({
        postponed: ['yes'],
        outlierGroups: [group({ remedyDate: '' })],
      })

      expect(body.groups[0].remedyDate).toBeNull()
    })

    it('drops groups that hold no members', async () => {
      const remedyDate = inWindowRemedyDate()

      const body = await run({
        outlierGroups: [
          group({ remedyDate }),
          group({ remedyDate, name: 'Tómur', employeeOrdinals: [] }),
        ],
      })

      expect(body.groups).toHaveLength(1)
      expect(body.groups[0].name).toBe('Hópur 1')
    })
  })

  // The equality-report id lives in externalData collected once at
  // PREREQUISITES, and DMR rejects it as soon as the company's equality report
  // is re-approved under a new id — so what matters is which id reaches
  // submitDraft, not that submit was called.
  describe('submitSalaryReport', () => {
    const run = async () => {
      const auth = createCurrentUser()
      const application = createApplication({
        answers: { approveExternalData: true },
        externalData: {
          activeEqualityReport: {
            data: { hasActiveEqualityReport: true, id: 'stale-id' },
            date: new Date(),
            status: 'success',
          },
        },
      })

      await service.submitSalaryReport({
        auth,
        application,
        currentUserLocale: 'is',
      } as Parameters<typeof service.submitSalaryReport>[0])

      return submitDraft.mock.calls[0][2]
    }

    it('submits the id DMR reports as active, not the one stored at prerequisites', async () => {
      const body = await run()

      expect(body.equalityReportId).toBe('fresh-id')
    })

    // A DMR outage is no reason to lose a finished report: the stored id is
    // still the best guess when nothing contradicts it.
    it('falls back to the stored id when DMR cannot answer', async () => {
      getActiveEqualityReport.mockRejectedValue(
        await FetchError.buildMock({ status: 500 }),
      )

      const body = await run()

      expect(body.equalityReportId).toBe('stale-id')
    })

    it('refuses to submit a known-stale id when DMR has no active report', async () => {
      getActiveEqualityReport.mockRejectedValue(
        await FetchError.buildMock({ status: 404 }),
      )

      await expect(run()).rejects.toThrow(TemplateApiError)
      expect(submitDraft).not.toHaveBeenCalled()
    })

    it('explains the missing equality report instead of the generic error', async () => {
      getActiveEqualityReport.mockRejectedValue(
        await FetchError.buildMock({ status: 404 }),
      )

      const error = await run().catch((e) => e)

      expect(error.problem.errorReason.summary).toBe(
        salaryReportMessages.errors.missingEqualityReport,
      )
    })
  })
})
