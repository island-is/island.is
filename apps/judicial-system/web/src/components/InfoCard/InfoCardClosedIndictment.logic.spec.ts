import type { InstitutionUser } from '@island.is/judicial-system/types'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  resolveClosedIndictmentAppealCase,
  shouldShowVerdictAppealOutcome,
} from './InfoCardClosedIndictment.logic'

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

describe('resolveClosedIndictmentAppealCase', () => {
  const caseLevel = { id: 'case-level-appeal' } as AppealCase
  const rulingOrder = { id: 'ruling-order-appeal' } as AppealCase
  const completedVerdictAppeal = {
    id: 'verdict-appeal',
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.COMPLETED,
  } as AppealCase
  const explicit = { id: 'explicit-appeal' } as AppealCase

  const workingCase = {
    appealCase: caseLevel,
    rulingOrderAppealCases: [rulingOrder],
    verdictAppealCase: completedVerdictAppeal,
  } as WorkingCase

  const onlyVerdictAppeal = (appeal: AppealCase) =>
    ({ appealCase: null, verdictAppealCase: appeal } as WorkingCase)

  it('takes the appeal passed in over everything else', () => {
    expect(
      resolveClosedIndictmentAppealCase(
        workingCase,
        explicit,
        'ruling-order-appeal',
      ),
    ).toBe(explicit)
  })

  it('keeps an explicit null as no appeal', () => {
    expect(
      resolveClosedIndictmentAppealCase(workingCase, null, undefined),
    ).toBeNull()
    expect(
      resolveClosedIndictmentAppealCase(
        onlyVerdictAppeal(completedVerdictAppeal),
        null,
        undefined,
      ),
    ).toBeNull()
  })

  it('takes the appeal named in the query string', () => {
    expect(
      resolveClosedIndictmentAppealCase(
        workingCase,
        undefined,
        'ruling-order-appeal',
      ),
    ).toBe(rulingOrder)
    expect(
      resolveClosedIndictmentAppealCase(
        workingCase,
        undefined,
        'verdict-appeal',
      ),
    ).toBe(completedVerdictAppeal)
  })

  it('takes the case level appeal before the verdict appeal', () => {
    expect(
      resolveClosedIndictmentAppealCase(workingCase, undefined, undefined),
    ).toBe(caseLevel)
  })

  it('takes a completed verdict appeal when there is no case level appeal', () => {
    expect(
      resolveClosedIndictmentAppealCase(
        onlyVerdictAppeal(completedVerdictAppeal),
        undefined,
        undefined,
      ),
    ).toBe(completedVerdictAppeal)
  })

  it.each([
    AppealCaseState.APPEALED,
    AppealCaseState.RECEIVED,
    AppealCaseState.READY_TO_COMPLETE,
    AppealCaseState.WITHDRAWN,
  ])('gives nothing for a verdict appeal in state %s', (appealState) => {
    expect(
      resolveClosedIndictmentAppealCase(
        onlyVerdictAppeal({ ...completedVerdictAppeal, appealState }),
        undefined,
        undefined,
      ),
    ).toBeUndefined()
  })

  it('gives nothing for a named appeal it cannot find', () => {
    expect(
      resolveClosedIndictmentAppealCase(
        onlyVerdictAppeal(completedVerdictAppeal),
        undefined,
        'unknown-appeal',
      ),
    ).toBeUndefined()
  })
})
