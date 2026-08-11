import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { mockCase, mockUser } from '../../../../utils/mocks'
import { canReopenCase } from './ReopenCaseModal'

describe('canReopenCase', () => {
  const completedIndictmentCase = {
    ...mockCase(CaseType.INDICTMENT),
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    indictmentCompletedDate: '2024-01-01',
    indictmentSentToPublicProsecutorDate: '2024-01-02',
  }

  const districtCourtUser = mockUser(UserRole.DISTRICT_COURT_JUDGE)

  it('allows reopening for a district court user when there is no appeal', () => {
    expect(canReopenCase(completedIndictmentCase, districtCourtUser)).toBe(true)
  })

  it('disallows reopening for non-district-court users', () => {
    expect(
      canReopenCase(completedIndictmentCase, mockUser(UserRole.PROSECUTOR)),
    ).toBe(false)
  })

  it('disallows reopening when the case is not completed', () => {
    const activeCase = {
      ...completedIndictmentCase,
      state: CaseState.RECEIVED,
    }

    expect(canReopenCase(activeCase, districtCourtUser)).toBe(false)
  })

  it('disallows reopening when there is an active appeal', () => {
    const caseWithActiveAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.RECEIVED },
    }

    expect(canReopenCase(caseWithActiveAppeal, districtCourtUser)).toBe(false)
  })

  it('disallows reopening when the appeal is in APPEALED state', () => {
    const caseWithAppealedAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.APPEALED },
    }

    expect(canReopenCase(caseWithAppealedAppeal, districtCourtUser)).toBe(false)
  })

  it('allows reopening when the appeal is completed', () => {
    const caseWithCompletedAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.COMPLETED },
    }

    expect(canReopenCase(caseWithCompletedAppeal, districtCourtUser)).toBe(true)
  })

  it('allows reopening when the appeal is withdrawn', () => {
    const caseWithWithdrawnAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.WITHDRAWN },
    }

    expect(canReopenCase(caseWithWithdrawnAppeal, districtCourtUser)).toBe(true)
  })

  it('disallows reopening when the indictment ruling decision is withdrawal', () => {
    const withdrawnCase = {
      ...completedIndictmentCase,
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
    }

    expect(canReopenCase(withdrawnCase, districtCourtUser)).toBe(false)
  })

  it('disallows reopening when the case has been merged', () => {
    const mergedCase = {
      ...completedIndictmentCase,
      mergeCase: { id: 'merged_case_id' },
    }

    expect(canReopenCase(mergedCase, districtCourtUser)).toBe(false)
  })

  it('disallows reopening when a ruling case has not been sent to public prosecutor', () => {
    const notSentCase = {
      ...completedIndictmentCase,
      indictmentSentToPublicProsecutorDate: undefined,
    }

    expect(canReopenCase(notSentCase, districtCourtUser)).toBe(false)
  })

  it('allows reopening a dismissed case even though it was never sent to public prosecutor', () => {
    const dismissedCase = {
      ...completedIndictmentCase,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      indictmentSentToPublicProsecutorDate: undefined,
    }

    expect(canReopenCase(dismissedCase, districtCourtUser)).toBe(true)
  })

  it('allows reopening a cancelled case even though it was never sent to public prosecutor', () => {
    const cancelledCase = {
      ...completedIndictmentCase,
      indictmentRulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
      indictmentSentToPublicProsecutorDate: undefined,
    }

    expect(canReopenCase(cancelledCase, districtCourtUser)).toBe(true)
  })
})
