import { Test, TestingModule } from '@nestjs/testing'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { ApplicationTypes } from '@island.is/application/types'
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

// `FetchError.buildMock` only fills `body` for problem+json responses, and DMR
// answers with plain application/json ApiErrorDto — so the body is attached by
// hand, exactly as the middleware would have parsed it.
const apiError = async (status: number, body?: Record<string, unknown>) => {
  const error = await FetchError.buildMock({ status })
  if (body) {
    ;(error as { body?: unknown }).body = body
  }
  return error
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
    getActiveEqualityReport = jest
      .fn()
      .mockResolvedValue({ source: 'REPORT', id: 'fresh-id' })
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

  // The prerequisites gate for both templates. DMR auto-provisions the company
  // on the first draft POST, so "company not found" must never stop an
  // applicant here — see getActiveEqualityReport.
  describe('getActiveEqualityReport', () => {
    const run = (typeId: ApplicationTypes) =>
      service.getActiveEqualityReport({
        auth: createCurrentUser(),
        application: createApplication({ typeId }),
        currentUserLocale: 'is',
      } as Parameters<typeof service.getActiveEqualityReport>[0])

    it('reports the active report when DMR has one', async () => {
      await expect(run(ApplicationTypes.EQUALITY_REPORT)).resolves.toEqual({
        hasActiveEqualityReport: true,
        source: 'REPORT',
        id: 'fresh-id',
      })
    })

    // The ~540 companies the legacy register covers: a 200 whose id fields are
    // all null. Reading that as "no plan" is what sent them to NOT_ALLOWED.
    it.each([ApplicationTypes.EQUALITY_REPORT, ApplicationTypes.SALARY_REPORT])(
      'counts legacy coverage as an active plan for %s',
      async (typeId) => {
        getActiveEqualityReport.mockResolvedValue({
          source: 'LEGACY',
          id: null,
          identifier: null,
          providerId: null,
          approvedAt: null,
          validUntil: new Date('2028-03-31T23:59:59.000Z'),
        })

        await expect(run(typeId)).resolves.toMatchObject({
          hasActiveEqualityReport: true,
          source: 'LEGACY',
          id: null,
        })
      },
    )

    it.each([ApplicationTypes.EQUALITY_REPORT, ApplicationTypes.SALARY_REPORT])(
      'reads a 404 as "no approved report" for %s',
      async (typeId) => {
        getActiveEqualityReport.mockRejectedValue(await apiError(404))

        await expect(run(typeId)).resolves.toEqual({
          hasActiveEqualityReport: false,
        })
      },
    )

    // The case behind the yellow "Fyrirtækið fannst ekki" alert: DMR does not
    // use 404 for an unknown company, it names the error instead. Surfacing it
    // locked first-time filers out of the very application that onboards them.
    it.each([ApplicationTypes.EQUALITY_REPORT, ApplicationTypes.SALARY_REPORT])(
      'reads an unknown company as "no approved report" for %s',
      async (typeId) => {
        getActiveEqualityReport.mockRejectedValue(
          await apiError(400, {
            name: 'NotFound',
            translatedMessage: 'Fyrirtækið fannst ekki',
          }),
        )

        await expect(run(typeId)).resolves.toEqual({
          hasActiveEqualityReport: false,
        })
      },
    )

    // An outage only costs the equality report its optional "previous plan"
    // step, so it is not worth standing between an applicant and their
    // jafnréttisáætlun.
    it('lets the equality report through when DMR is down', async () => {
      getActiveEqualityReport.mockRejectedValue(await apiError(500))

      await expect(run(ApplicationTypes.EQUALITY_REPORT)).resolves.toEqual({
        hasActiveEqualityReport: false,
      })
    })

    // The salary report turns the flag straight into NOT_ALLOWED, so a false
    // answer during an outage would reject a company that does hold a plan.
    it('surfaces an outage on the salary report instead of rejecting', async () => {
      getActiveEqualityReport.mockRejectedValue(await apiError(500))

      await expect(run(ApplicationTypes.SALARY_REPORT)).rejects.toThrow(
        TemplateApiError,
      )
    })

    it("prefers DMR's translated message when it surfaces an outage", async () => {
      getActiveEqualityReport.mockRejectedValue(
        await apiError(503, { translatedMessage: 'Þjónusta liggur niðri' }),
      )

      const error = await run(ApplicationTypes.SALARY_REPORT).catch((e) => e)

      expect(error.problem.errorReason.summary).toBe('Þjónusta liggur niðri')
    })
  })

  // What matters is which equality-report id reaches submitDraft, not that
  // submit was called — see resolveEqualityReportId's staleness handling.
  describe('submitSalaryReport', () => {
    // Not FormValue: this is externalData, and a legacy row really does carry
    // `id: null` — the provider spreads DMR's answer through as it stands.
    const run = async (
      persisted: Record<string, unknown> = {
        hasActiveEqualityReport: true,
        source: 'REPORT',
        id: 'stale-id',
      },
    ) => {
      const auth = createCurrentUser()
      const application = createApplication({
        answers: { approveExternalData: true },
        externalData: {
          activeEqualityReport: {
            data: persisted,
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

    // The stored id is still the best guess when DMR gives no answer.
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

    // Legacy coverage has no report row to name, so the field goes off the
    // submission entirely and DMR resolves the certificate itself. Sending the
    // id persisted from an earlier, now-superseded report would be worse than
    // sending nothing: DMR rejects it.
    it('omits the id when DMR reports legacy coverage', async () => {
      getActiveEqualityReport.mockResolvedValue({
        source: 'LEGACY',
        id: null,
        providerId: null,
        validUntil: new Date('2028-03-31T23:59:59.000Z'),
      })

      const body = await run()

      expect(submitDraft).toHaveBeenCalled()
      expect(body.equalityReportId).toBeUndefined()
    })

    // The outage fallback has to carry the same distinction: what was stored at
    // PREREQUISITES is a source with no id, and that still submits.
    it('submits legacy coverage stored at prerequisites when DMR cannot answer', async () => {
      getActiveEqualityReport.mockRejectedValue(
        await FetchError.buildMock({ status: 500 }),
      )

      const body = await run({
        hasActiveEqualityReport: true,
        source: 'LEGACY',
        id: null,
      })

      expect(submitDraft).toHaveBeenCalled()
      expect(body.equalityReportId).toBeUndefined()
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
