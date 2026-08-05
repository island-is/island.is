import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'
import { caseTableCellGenerators } from './caseTable.cellGenerators'

describe('indictment ruling decision cell generators', () => {
  const user = { role: UserRole.PROSECUTOR } as User

  const dismissedAppealedCase = {
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
    appealCase: { appealState: AppealCaseState.APPEALED },
  } as Case

  it('appends the appeal state tag to dismissals', () => {
    const cell = caseTableCellGenerators.indictmentRulingDecision.generate(
      dismissedAppealedCase,
      user,
    )

    expect(cell.value).toEqual({
      firstTag: { color: 'blue', text: 'Frávísun' },
      secondTag: { color: 'red', text: 'Kært' },
    })
  })

  it('omits the appeal state tag from dismissals when the table has a separate appeal state column', () => {
    const cell =
      caseTableCellGenerators.indictmentRulingDecisionWithoutAppealState.generate(
        dismissedAppealedCase,
        user,
      )

    expect(cell.value).toEqual({ color: 'blue', text: 'Frávísun' })
  })

  it('leaves the cell empty for cases that are not completed', () => {
    const cell =
      caseTableCellGenerators.indictmentRulingDecisionWithoutAppealState.generate(
        { state: CaseState.RECEIVED } as Case,
        user,
      )

    expect(cell.value).toBeUndefined()
  })
})
