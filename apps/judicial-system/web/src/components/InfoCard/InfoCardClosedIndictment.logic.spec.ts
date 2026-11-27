import type { InstitutionUser } from '@island.is/judicial-system/types'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { shouldShowVerdictAppealOutcome } from './InfoCardClosedIndictment.logic'

const courtOfAppealsJudge: InstitutionUser = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  institution: { type: InstitutionType.COURT_OF_APPEALS },
}

const prosecutor: InstitutionUser = {
  role: UserRole.PROSECUTOR,
  institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
}

const verdictAppeal = {
  appealType: AppealCaseType.VERDICT,
  appealState: AppealCaseState.READY_TO_COMPLETE,
  appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
}

describe('shouldShowVerdictAppealOutcome', () => {
  it.each([AppealCaseState.READY_TO_COMPLETE, AppealCaseState.COMPLETED])(
    'is true for the Court of Appeals on a verdict appeal with an outcome in state %s',
    (appealState) => {
      expect(
        shouldShowVerdictAppealOutcome(
          { ...verdictAppeal, appealState },
          courtOfAppealsJudge,
        ),
      ).toBe(true)
    },
  )

  it('is true for anyone once the appeal is completed', () => {
    const completed = {
      ...verdictAppeal,
      appealState: AppealCaseState.COMPLETED,
    }

    expect(shouldShowVerdictAppealOutcome(completed, prosecutor)).toBe(true)
    expect(shouldShowVerdictAppealOutcome(completed, undefined)).toBe(true)
  })

  it.each([
    AppealCaseState.APPEALED,
    AppealCaseState.READY_TO_COMPLETE,
    AppealCaseState.WITHDRAWN,
  ])('is false outside the Court of Appeals in state %s', (appealState) => {
    expect(
      shouldShowVerdictAppealOutcome(
        { ...verdictAppeal, appealState },
        prosecutor,
      ),
    ).toBe(false)
  })

  it('is false outside the Court of Appeals before the appeal is completed', () => {
    expect(shouldShowVerdictAppealOutcome(verdictAppeal, prosecutor)).toBe(
      false,
    )
    expect(shouldShowVerdictAppealOutcome(verdictAppeal, undefined)).toBe(false)
  })

  it('is false before the court confirms the appeal', () => {
    expect(
      shouldShowVerdictAppealOutcome(
        { ...verdictAppeal, appealState: AppealCaseState.APPEALED },
        courtOfAppealsJudge,
      ),
    ).toBe(false)
  })

  it('is false before an outcome is recorded', () => {
    expect(
      shouldShowVerdictAppealOutcome(
        { ...verdictAppeal, appealRulingDecision: null },
        courtOfAppealsJudge,
      ),
    ).toBe(false)
  })

  it('is false for an appeal that is not a verdict appeal', () => {
    expect(
      shouldShowVerdictAppealOutcome(
        { ...verdictAppeal, appealType: AppealCaseType.RULING },
        courtOfAppealsJudge,
      ),
    ).toBe(false)
    expect(shouldShowVerdictAppealOutcome(null, courtOfAppealsJudge)).toBe(
      false,
    )
  })
})
