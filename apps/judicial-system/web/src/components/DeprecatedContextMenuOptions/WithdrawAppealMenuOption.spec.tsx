import { renderHook } from '@testing-library/react'

import {
  AppealCaseState,
  CaseListEntry,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { useWithdrawAppealMenuOption } from './WithdrawAppealMenuOption'

const shouldDisplay = (caseEntry: CaseListEntry, userNationalId?: string) => {
  const { result } = renderHook(() => useWithdrawAppealMenuOption(), {
    wrapper: IntlProviderWrapper,
  })

  return result.current.shouldDisplayWithdrawAppealOption(
    caseEntry,
    userNationalId,
  )
}

describe('useWithdrawAppealMenuOption - shouldDisplayWithdrawAppealOption', () => {
  const indictmentAppeal = (
    overrides: Partial<CaseListEntry> = {},
  ): CaseListEntry =>
    ({
      type: CaseType.INDICTMENT,
      appealState: AppealCaseState.APPEALED,
      // Legacy gate kept as-is (separate column, retired in Phase 4).
      accusedPostponedAppealDate: '2026-01-01T00:00:00.000Z',
      appealedByDefendantId: 'd-1',
      defendants: [
        {
          id: 'd-1',
          isDefenderChoiceConfirmed: true,
          defenderNationalId: '0101011010',
        },
      ],
      ...overrides,
    } as CaseListEntry)

  it('shows for the current defender of the appellant defendant', () => {
    expect(shouldDisplay(indictmentAppeal(), '0101011010')).toBe(true)
  })

  it('hides for a different defender (survives a swap)', () => {
    expect(shouldDisplay(indictmentAppeal(), '9999999999')).toBe(false)
  })

  it('hides when the appellant defendant is unknown', () => {
    expect(
      shouldDisplay(
        indictmentAppeal({ appealedByDefendantId: 'other' }),
        '0101011010',
      ),
    ).toBe(false)
  })

  it('hides when the appeal is not in a withdrawable state', () => {
    expect(
      shouldDisplay(
        indictmentAppeal({ appealState: AppealCaseState.COMPLETED }),
        '0101011010',
      ),
    ).toBe(false)
  })
})
