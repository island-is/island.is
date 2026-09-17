import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealEventType,
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

describe('verdict appeal cell generators', () => {
  const user = { role: UserRole.COURT_OF_APPEALS_JUDGE } as User

  const appealEvent = (
    eventType: AppealEventType,
    userRole: UserRole,
    created = new Date('2026-06-10T09:00:00.000Z'),
  ) => ({ eventType, userRole, defendantId: 'defendant_id', created })

  const caseWithVerdictAppeal = (verdictAppealCase: unknown): Case =>
    ({ verdictAppealCase } as Case)

  describe('who appealed', () => {
    it('names the prosecution when it appealed', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.PROSECUTOR),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Ákæruvald' })
    })

    it('names the defendant when the defence appealed', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.DEFENDER),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Dómfelldi' })
    })

    // One row per case, so when both sides appealed the prosecution is the one
    // named (owner, 2026-09-17).
    it('gives the prosecution priority when both appealed', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.DEFENDER),
            appealEvent(AppealEventType.APPEALED, UserRole.PROSECUTOR),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Ákæruvald' })
    })

    it('names nobody once the only appeal has been withdrawn', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.PROSECUTOR),
            appealEvent(
              AppealEventType.APPEAL_WITHDRAWN,
              UserRole.PROSECUTOR,
              new Date('2026-06-11T09:00:00.000Z'),
            ),
          ],
        }),
        user,
      )

      expect(cell.value).toBeUndefined()
    })
  })

  describe('state', () => {
    // A verdict appeal reaches the court of appeals before the court has
    // received it, which a ruling appeal never does.
    it('shows a filed appeal as new', () => {
      const cell = caseTableCellGenerators.verdictAppealState.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.APPEALED }),
        user,
      )

      expect(cell.value).toEqual({ color: 'purple', text: 'Nýtt' })
    })

    it('shows a received appeal as received', () => {
      const cell = caseTableCellGenerators.verdictAppealState.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.RECEIVED }),
        user,
      )

      expect(cell.value).toEqual({ color: 'darkerBlue', text: 'Móttekið' })
    })
  })

  describe('result', () => {
    it('shows the ruling of a completed appeal', () => {
      const cell = caseTableCellGenerators.verdictAppealResult.generate(
        caseWithVerdictAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
        }),
        user,
      )

      expect(cell.value).toEqual({ color: 'mint', text: 'Staðfest' })
    })

    // A withdrawal ends the appeal without a ruling, and the design puts it in
    // the completed list under the result column.
    it('shows a withdrawal as the result', () => {
      const cell = caseTableCellGenerators.verdictAppealResult.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.WITHDRAWN }),
        user,
      )

      expect(cell.value).toEqual({ color: 'red', text: 'Afturkallað' })
    })

    it('leaves the result empty while the appeal is still open', () => {
      const cell = caseTableCellGenerators.verdictAppealResult.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.APPEALED }),
        user,
      )

      expect(cell.value).toBeUndefined()
    })
  })

  describe('when the case ended', () => {
    it('uses the ruling date of a completed appeal', () => {
      const cell = caseTableCellGenerators.verdictAppealCompletedDate.generate(
        caseWithVerdictAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingDate: new Date('2026-11-10T10:00:00.000Z'),
        }),
        user,
      )

      expect(cell.value).toEqual({ str: '10.11.2026' })
    })

    // A withdrawn appeal has no ruling, so the withdrawal is when it ended.
    it('uses the withdrawal for a withdrawn appeal', () => {
      const cell = caseTableCellGenerators.verdictAppealCompletedDate.generate(
        caseWithVerdictAppeal({
          appealState: AppealCaseState.WITHDRAWN,
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.PROSECUTOR,
              new Date('2026-10-01T09:00:00.000Z'),
            ),
            appealEvent(
              AppealEventType.APPEAL_WITHDRAWN,
              UserRole.PROSECUTOR,
              new Date('2026-10-14T09:00:00.000Z'),
            ),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: '14.10.2026' })
    })
  })
})
