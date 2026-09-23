import { YES } from '@island.is/application/core'
import type {
  Application,
  ApplicationContext,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import {
  getEarliestSubmissionDate,
  getSalaryIneligibilityReason,
  hasPostponedOutlierPlan,
  isSalaryReportEligible,
} from './eligibility'

const analysis = (outlierCount: number): ExternalData =>
  ({
    salaryAnalysisResult: {
      status: 'success',
      data: {
        outliers: Array.from({ length: outlierCount }, (_, index) => ({
          employeeOrdinal: index + 1,
        })),
      } as unknown as SalaryAnalysisResponseDto,
    },
  } as unknown as ExternalData)

const ctx = (answers: FormValue, externalData: ExternalData) =>
  ({
    application: { answers, externalData },
  } as unknown as ApplicationContext)

describe('hasPostponedOutlierPlan', () => {
  it('postpones when the applicant asked to and a plan is actually required', () => {
    expect(
      hasPostponedOutlierPlan(
        ctx({ salaryAnalysis: { postponed: [YES] } }, analysis(2)),
      ),
    ).toBe(true)
  })

  it('does not postpone when the applicant never asked to', () => {
    expect(hasPostponedOutlierPlan(ctx({}, analysis(2)))).toBe(false)
    expect(
      hasPostponedOutlierPlan(
        ctx({ salaryAnalysis: { postponed: [] } }, analysis(2)),
      ),
    ).toBe(false)
  })

  // Nothing clears the postpone answer in DRAFT, so an applicant who ticks
  // "fresta" and then edits the data until the analysis lists no outliers still
  // carries it at submit time. Postponing there would park the application in
  // POSTPONED awaiting an úrbótaáætlun they have nothing to write.
  it('does not postpone a report the analysis no longer requires a plan for', () => {
    expect(
      hasPostponedOutlierPlan(
        ctx(
          {
            salaryAnalysis: {
              postponed: [YES],
              hasMinimumSetOutliers: false,
            },
          },
          analysis(0),
        ),
      ),
    ).toBe(false)
  })

  // No stored snapshot: the mirrored answer is all there is to go on, and it
  // says a plan is required — so the postpone stands.
  it('falls back to the mirrored answer when no analysis is stored', () => {
    expect(
      hasPostponedOutlierPlan(
        ctx(
          {
            salaryAnalysis: {
              postponed: [YES],
              hasMinimumSetOutliers: true,
            },
          },
          {} as ExternalData,
        ),
      ),
    ).toBe(true)
  })
})

const eligibility = (data: unknown): ExternalData =>
  ({
    salaryReportEligibility: { status: 'success', data },
  } as unknown as ExternalData)

// The reason and date readers take the application itself, not the xstate
// context the transition guard is handed.
const application = (externalData: ExternalData) =>
  ({ externalData } as unknown as Application)

// The guard on the PREREQUISITES → DRAFT transition. Anything other than an
// explicit `true` keeps the applicant out, because the alternative — reading a
// shape we did not expect as "eligible" — walks a company that DMR refuses into
// the full data-entry flow.
describe('isSalaryReportEligible', () => {
  it('admits a company DMR says is eligible', () => {
    expect(
      isSalaryReportEligible(ctx({}, eligibility({ eligible: true }))),
    ).toBe(true)
  })

  it('refuses a company DMR says is not', () => {
    expect(
      isSalaryReportEligible(
        ctx(
          {},
          eligibility({
            eligible: false,
            reason: 'RENEWAL_WINDOW_NOT_OPEN',
          }),
        ),
      ),
    ).toBe(false)
  })

  it('refuses when the answer is missing or not a boolean true', () => {
    expect(isSalaryReportEligible(ctx({}, {} as ExternalData))).toBe(false)
    expect(isSalaryReportEligible(ctx({}, eligibility({})))).toBe(false)
    expect(
      isSalaryReportEligible(ctx({}, eligibility({ eligible: 'true' }))),
    ).toBe(false)
  })
})

// Both read straight off the same provider payload; the notAllowed screen picks
// its message from the first and interpolates the second.
describe('getSalaryIneligibilityReason', () => {
  it('reads the reason DMR gave', () => {
    expect(
      getSalaryIneligibilityReason(
        application(
          eligibility({ eligible: false, reason: 'MISSING_EQUALITY_REPORT' }),
        ),
      ),
    ).toBe('MISSING_EQUALITY_REPORT')
  })

  // Null when eligible, and absent entirely for the role whose read scope
  // never fetched it — the screen treats both as "not the renewal case".
  it('reads a missing reason as undefined', () => {
    expect(
      getSalaryIneligibilityReason(
        application(eligibility({ eligible: true })),
      ),
    ).toBeUndefined()
    expect(
      getSalaryIneligibilityReason(application({} as ExternalData)),
    ).toBeUndefined()
  })
})

describe('getEarliestSubmissionDate', () => {
  it('reads the date DMR gave', () => {
    expect(
      getEarliestSubmissionDate(
        application(
          eligibility({
            eligible: false,
            reason: 'RENEWAL_WINDOW_NOT_OPEN',
            earliestSubmissionDate: '2026-04-03T00:00:00.000Z',
          }),
        ),
      ),
    ).toBe('2026-04-03T00:00:00.000Z')
  })

  // Documented nullable: there is no window to anchor on until DMR has a due
  // date, and the screen falls back to a dateless message.
  it('reads a missing date as undefined', () => {
    expect(
      getEarliestSubmissionDate(
        application(
          eligibility({ eligible: false, reason: 'RENEWAL_WINDOW_NOT_OPEN' }),
        ),
      ),
    ).toBeUndefined()
  })
})
