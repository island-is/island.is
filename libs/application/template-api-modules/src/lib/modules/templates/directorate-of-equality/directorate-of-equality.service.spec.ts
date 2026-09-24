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
  let getSalaryReportEligibility: jest.Mock
  let updateDraft: jest.Mock
  let submitDraft: jest.Mock
  let deleteDraft: jest.Mock
  let withdrawReport: jest.Mock
  let getReport: jest.Mock

  beforeEach(async () => {
    editOutliers = jest.fn().mockResolvedValue({})
    getActiveEqualityReport = jest
      .fn()
      .mockResolvedValue({ source: 'REPORT', id: 'fresh-id' })
    getSalaryReportEligibility = jest.fn().mockResolvedValue({ eligible: true })
    updateDraft = jest.fn().mockResolvedValue({})
    submitDraft = jest.fn().mockResolvedValue({})
    deleteDraft = jest.fn().mockResolvedValue(undefined)
    withdrawReport = jest.fn().mockResolvedValue(undefined)
    getReport = jest.fn().mockResolvedValue({ status: 'APPROVED' })

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
            getSalaryReportEligibility,
            updateDraft,
            submitDraft,
            deleteDraft,
            withdrawReport,
            getReport,
          },
        },
      ],
    }).compile()

    service = module.get<DirectorateOfEqualityService>(
      DirectorateOfEqualityService,
    )
  })

  // onDelete: a failure here refuses the applicant's delete, so only the
  // answers that leave nothing open at DMR may pass.
  describe('deleteSalaryReportDraft', () => {
    const application = createApplication({ answers: {} })
    const run = () =>
      service.deleteSalaryReportDraft({
        auth: createCurrentUser(),
        application,
        currentUserLocale: 'is',
      } as Parameters<typeof service.deleteSalaryReportDraft>[0])

    it('hard-deletes the draft and does not withdraw', async () => {
      await expect(run()).resolves.toBeUndefined()

      expect(deleteDraft).toHaveBeenCalledWith(
        expect.anything(),
        application.id,
      )
      expect(withdrawReport).not.toHaveBeenCalled()
    })

    // The draft was submitted between the applicant opening the delete and
    // confirming it, so the report has to be withdrawn instead.
    it('withdraws when there is no draft left to delete', async () => {
      deleteDraft.mockRejectedValue(await apiError(404))

      await expect(run()).resolves.toBeUndefined()

      expect(withdrawReport).toHaveBeenCalledWith(
        expect.anything(),
        application.id,
      )
    })

    it('lets the delete through when DMR has nothing at all', async () => {
      deleteDraft.mockRejectedValue(await apiError(404))
      withdrawReport.mockRejectedValue(await apiError(404))

      await expect(run()).resolves.toBeUndefined()
    })

    it('lets the delete through when the submitted report is already decided', async () => {
      deleteDraft.mockRejectedValue(await apiError(404))
      withdrawReport.mockRejectedValue(await apiError(400))

      await expect(run()).resolves.toBeUndefined()
    })

    it('refuses the delete when the fallback withdraw fails', async () => {
      deleteDraft.mockRejectedValue(await apiError(404))
      withdrawReport.mockRejectedValue(
        await FetchError.buildMock({ status: 500 }),
      )

      await expect(run()).rejects.toThrow(TemplateApiError)
    })

    it('refuses the delete when DMR fails', async () => {
      deleteDraft.mockRejectedValue(await FetchError.buildMock({ status: 500 }))

      await expect(run()).rejects.toThrow(TemplateApiError)
      expect(withdrawReport).not.toHaveBeenCalled()
    })
  })

  describe('withdrawSalaryReport', () => {
    const application = createApplication({ answers: {} })
    const run = () =>
      service.withdrawSalaryReport({
        auth: createCurrentUser(),
        application,
        currentUserLocale: 'is',
      } as Parameters<typeof service.withdrawSalaryReport>[0])

    it('withdraws the report tied to the application', async () => {
      await expect(run()).resolves.toBeUndefined()

      expect(withdrawReport).toHaveBeenCalledWith(
        expect.anything(),
        application.id,
      )
    })

    it('lets the delete through when DMR has no report', async () => {
      withdrawReport.mockRejectedValue(await apiError(404))

      await expect(run()).resolves.toBeUndefined()
    })

    // DMR names the "already decided" refusal like any other bad request, so a
    // 400 passes only once the report itself reads as closed.
    it.each(['APPROVED', 'DENIED', 'SUPERSEDED', 'WITHDRAWN'])(
      'lets the delete through on a 400 when the report is %s',
      async (status) => {
        withdrawReport.mockRejectedValue(await apiError(400))
        getReport.mockResolvedValue({ status })

        await expect(run()).resolves.toBeUndefined()
        expect(getReport).toHaveBeenCalledWith(
          expect.anything(),
          application.id,
        )
      },
    )

    it('refuses the delete on a 400 while the report is still open', async () => {
      withdrawReport.mockRejectedValue(
        await apiError(400, { name: 'ValidationError' }),
      )
      getReport.mockResolvedValue({ status: 'POSTPONED' })

      await expect(run()).rejects.toThrow(TemplateApiError)
    })

    it('refuses the delete on a 400 when the status cannot be read', async () => {
      withdrawReport.mockRejectedValue(await apiError(400))
      getReport.mockRejectedValue(await FetchError.buildMock({ status: 500 }))

      await expect(run()).rejects.toThrow(TemplateApiError)
    })

    it('refuses the delete when DMR fails', async () => {
      withdrawReport.mockRejectedValue(
        await FetchError.buildMock({ status: 500 }),
      )

      await expect(run()).rejects.toThrow(TemplateApiError)
    })
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
  describe('getSalaryReportEligibility', () => {
    const run = async () => {
      const auth = createCurrentUser()
      const application = createApplication({
        answers: { approveExternalData: true },
      })

      return service.getSalaryReportEligibility({
        auth,
        application,
        currentUserLocale: 'is',
      } as Parameters<typeof service.getSalaryReportEligibility>[0])
    }

    it("passes DMR's answer through with both deadlines", async () => {
      const dueAt = new Date('2027-10-03T23:59:59.999Z')
      const earliestNewDueAt = new Date('2029-09-23T23:59:59.999Z')
      getSalaryReportEligibility.mockResolvedValue({
        eligible: true,
        reason: null,
        dueAt,
        earliestNewDueAt,
      })

      await expect(run()).resolves.toEqual({
        eligible: true,
        reason: null,
        dueAt,
        earliestNewDueAt,
      })
    })

    // A company DMR has never seen owes the equality plan first — the same
    // answer it gives a known company without one. DMR does not use 404
    // consistently for it, hence the NotFound body rather than the status.
    it('reads an unknown company as owing the equality plan', async () => {
      getSalaryReportEligibility.mockRejectedValue(
        await apiError(400, {
          name: 'NotFound',
          translatedMessage: 'Fyrirtækið fannst ekki',
        }),
      )

      await expect(run()).resolves.toEqual({
        eligible: false,
        reason: 'MISSING_EQUALITY_REPORT',
      })
    })

    // The guard has to fail loudly: answering "ineligible" on an outage would
    // turn DMR being down into a rejection for a company that is eligible.
    it('surfaces an outage instead of rejecting the applicant', async () => {
      getSalaryReportEligibility.mockRejectedValue(
        await FetchError.buildMock({ status: 500 }),
      )

      await expect(run()).rejects.toThrow(TemplateApiError)
    })
  })

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

    // DMR says "no such company" with a 400 and a NotFound body, not a 404 —
    // the provider gate above already allows for that, and so must this one, or
    // a definitive rejection reaches the applicant as a generic error.
    it('refuses to submit when DMR names the company as not found', async () => {
      getActiveEqualityReport.mockRejectedValue(
        await apiError(400, {
          name: 'NotFound',
          translatedMessage: 'Fyrirtækið fannst ekki',
        }),
      )

      const error = await run().catch((e) => e)

      expect(submitDraft).not.toHaveBeenCalled()
      expect(error.problem.errorReason.summary).toBe(
        salaryReportMessages.errors.missingEqualityReport,
      )
    })

    // Both 409s DMR has left — a report already in review and a providerId
    // collision — read as a report in progress, with no second round trip.
    it('explains a 409 as a report already in progress', async () => {
      submitDraft.mockRejectedValue(await apiError(409))

      const error = await run().catch((e) => e)

      expect(getSalaryReportEligibility).not.toHaveBeenCalled()
      expect(error.problem.errorReason.summary).toBe(
        salaryReportMessages.errors.submitConflict,
      )
    })

    // Reachable now that coverage can be left for DMR to resolve: the
    // certificate lapses between the pre-check and the submit itself.
    it('explains a 404 from the submit as missing coverage', async () => {
      submitDraft.mockRejectedValue(await apiError(404))

      const error = await run().catch((e) => e)

      expect(error.problem.errorReason.summary).toBe(
        salaryReportMessages.errors.missingEqualityReport,
      )
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
