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
  appealState: AppealCaseState.COMPLETED,
  appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
}

describe('shouldShowVerdictAppealOutcome', () => {
  it('is true for the Court of Appeals on a verdict appeal with an outcome', () => {
    expect(
      shouldShowVerdictAppealOutcome(verdictAppeal, courtOfAppealsJudge),
    ).toBe(true)
  })

  it('is false for anyone outside the Court of Appeals', () => {
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
