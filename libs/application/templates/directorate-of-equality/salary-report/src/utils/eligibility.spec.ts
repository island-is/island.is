import { YES } from '@island.is/application/core'
import type {
  ApplicationContext,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { hasPostponedOutlierPlan } from './eligibility'

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
