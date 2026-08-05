import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseState,
  AppealEventType,
  CaseActionType,
  CaseState,
  CaseType,
  ContextMenuCaseActionType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'
import {
  canCancelAppeal,
  canDeleteCase,
  canDeleteIndictmentCase,
  canDeleteRequestCase,
  getActionOnRowClick,
  getAttributes,
  getContextMenuActions,
  isMyCase,
} from './caseTable.utils'

/** Minimal user shape for type guards (role + institution.type). */
const prosecutionUser = (id: string): User =>
  ({
    id,
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE },
  } as User)

const districtCourtJudge = (id: string): User =>
  ({
    id,
    role: UserRole.DISTRICT_COURT_JUDGE,
    institution: { type: InstitutionType.DISTRICT_COURT },
  } as User)

const defenceUser = (nationalId: string): User =>
  ({
    id: 'defender-1',
    role: UserRole.DEFENDER,
    nationalId,
  } as User)

describe('caseTable.utils', () => {
  describe('getAttributes', () => {
    // canCancelAppeal (via userIsAppellant) only sees the attributes fetched for
    // the user's role, so every case column it reads must be listed here
    it('fetches the case attributes canCancelAppeal reads for prosecution users', () => {
      const attributes = getAttributes([], prosecutionUser('p-1'))
      expect(attributes).toEqual(expect.arrayContaining(['type']))
    })

    it('fetches the case attributes canCancelAppeal reads for defence users', () => {
      const attributes = getAttributes([], defenceUser('1111111111'))
      expect(attributes).toEqual(
        expect.arrayContaining(['type', 'defenderNationalId']),
      )
    })
  })

  describe('isMyCase', () => {
    it('returns true for prosecution user when they are creating prosecutor', () => {
      const user = prosecutionUser('user-1')
      const theCase = {
        creatingProsecutorId: 'user-1',
        prosecutorId: 'other',
        judgeId: null,
        registrarId: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns true for prosecution user when they are prosecutor', () => {
      const user = prosecutionUser('user-1')
      const theCase = {
        creatingProsecutorId: 'other',
        prosecutorId: 'user-1',
        judgeId: null,
        registrarId: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns false for prosecution user when neither matches', () => {
      const user = prosecutionUser('user-1')
      const theCase = {
        creatingProsecutorId: 'other',
        prosecutorId: 'other2',
        judgeId: null,
        registrarId: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(false)
    })

    it('returns true for district court user when they are judge', () => {
      const user = districtCourtJudge('judge-1')
      const theCase = {
        creatingProsecutorId: null,
        prosecutorId: null,
        judgeId: 'judge-1',
        registrarId: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns true for district court user when they are registrar', () => {
      const user = districtCourtJudge('reg-1')
      const theCase = {
        creatingProsecutorId: null,
        prosecutorId: null,
        judgeId: null,
        registrarId: 'reg-1',
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns false for district court user when neither matches', () => {
      const user = districtCourtJudge('user-1')
      const theCase = {
        creatingProsecutorId: null,
        prosecutorId: null,
        judgeId: 'other',
        registrarId: 'other2',
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(false)
    })
  })

  describe('getActionOnRowClick', () => {
    it('returns COMPLETE_CANCELLED_CASE for district court indictment waiting for cancellation', () => {
      const user = districtCourtJudge('judge-1')
      const theCase = {
        type: CaseType.INDICTMENT,
        state: CaseState.WAITING_FOR_CANCELLATION,
      }
      expect(getActionOnRowClick(theCase, user)).toBe(
        CaseActionType.COMPLETE_CANCELLED_CASE,
      )
    })

    it('returns OPEN_CASE for prosecution user', () => {
      const user = prosecutionUser('p-1')
      const theCase = {
        type: CaseType.INDICTMENT,
        state: CaseState.WAITING_FOR_CANCELLATION,
      }
      expect(getActionOnRowClick(theCase, user)).toBe(CaseActionType.OPEN_CASE)
    })

    it('returns OPEN_CASE for district court when not indictment or not waiting for cancellation', () => {
      const user = districtCourtJudge('judge-1')
      expect(
        getActionOnRowClick(
          { type: CaseType.CUSTODY, state: CaseState.SUBMITTED },
          user,
        ),
      ).toBe(CaseActionType.OPEN_CASE)
      expect(
        getActionOnRowClick(
          { type: CaseType.INDICTMENT, state: CaseState.DRAFT },
          user,
        ),
      ).toBe(CaseActionType.OPEN_CASE)
    })
  })

  describe('canDeleteRequestCase', () => {
    it.each([
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
    ])('returns true for state %s', (state) => {
      expect(canDeleteRequestCase({ state })).toBe(true)
    })

    it('returns false for other states', () => {
      expect(canDeleteRequestCase({ state: CaseState.ACCEPTED })).toBe(false)
      expect(canDeleteRequestCase({ state: CaseState.REJECTED })).toBe(false)
    })
  })

  describe('canDeleteIndictmentCase', () => {
    it('returns true for DRAFT and WAITING_FOR_CONFIRMATION', () => {
      expect(canDeleteIndictmentCase({ state: CaseState.DRAFT })).toBe(true)
      expect(
        canDeleteIndictmentCase({ state: CaseState.WAITING_FOR_CONFIRMATION }),
      ).toBe(true)
    })

    it('returns false for other states', () => {
      expect(canDeleteIndictmentCase({ state: CaseState.SUBMITTED })).toBe(
        false,
      )
    })
  })

  describe('canDeleteCase', () => {
    it('returns false for non-prosecution user', () => {
      const user = districtCourtJudge('judge-1')
      expect(
        canDeleteCase({ type: CaseType.CUSTODY, state: CaseState.DRAFT }, user),
      ).toBe(false)
    })

    it('returns true for prosecution user and deletable request case', () => {
      const user = prosecutionUser('p-1')
      expect(
        canDeleteCase({ type: CaseType.CUSTODY, state: CaseState.DRAFT }, user),
      ).toBe(true)
    })

    it('returns true for prosecution user and deletable indictment case', () => {
      const user = prosecutionUser('p-1')
      expect(
        canDeleteCase(
          { type: CaseType.INDICTMENT, state: CaseState.DRAFT },
          user,
        ),
      ).toBe(true)
    })

    it('returns false for prosecution user and non-deletable request case', () => {
      const user = prosecutionUser('p-1')
      expect(
        canDeleteCase(
          { type: CaseType.CUSTODY, state: CaseState.ACCEPTED },
          user,
        ),
      ).toBe(false)
    })
  })

  describe('canCancelAppeal', () => {
    const prosecutorAppealed = {
      eventType: AppealEventType.APPEALED,
      userRole: UserRole.PROSECUTOR,
    }
    const defenderAppealed = {
      eventType: AppealEventType.APPEALED,
      userRole: UserRole.DEFENDER,
    }

    it('returns false for a court user even when the case was appealed', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [prosecutorAppealed],
            },
          } as unknown as Case,
          districtCourtJudge('judge-1'),
        ),
      ).toBe(false)
    })

    it('returns true for prosecution when a prosecution APPEALED event exists', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.INDICTMENT,
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [prosecutorAppealed],
            },
          } as unknown as Case,
          prosecutionUser('p-1'),
        ),
      ).toBe(true)
    })

    it('returns true for prosecution on a RECEIVED appeal', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealCase: {
              appealState: AppealCaseState.RECEIVED,
              appealEventLogs: [prosecutorAppealed],
            },
          } as unknown as Case,
          prosecutionUser('p-1'),
        ),
      ).toBe(true)
    })

    it('returns false for prosecution when only the defence appealed', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [defenderAppealed],
            },
          } as unknown as Case,
          prosecutionUser('p-1'),
        ),
      ).toBe(false)
    })

    it('returns false when there are no APPEALED events', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [],
            },
          } as unknown as Case,
          prosecutionUser('p-1'),
        ),
      ).toBe(false)
    })

    it('returns true for the assigned defender when the defence appealed a request case', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            defenderNationalId: '1111111111',
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [defenderAppealed],
            },
          } as unknown as Case,
          defenceUser('1111111111'),
        ),
      ).toBe(true)
    })

    it('returns false for a defence user who is not the assigned defender of a request case', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            defenderNationalId: '1111111111',
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [defenderAppealed],
            },
          } as unknown as Case,
          defenceUser('2222222222'),
        ),
      ).toBe(false)
    })

    it('returns false for the defender when only the prosecution appealed a request case', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            defenderNationalId: '1111111111',
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [prosecutorAppealed],
            },
          } as unknown as Case,
          defenceUser('1111111111'),
        ),
      ).toBe(false)
    })

    // Request cases have one collective appeal and the prosecution's appeal takes
    // precedence, so the defender cannot withdraw when the prosecution also
    // appealed - only the prosecution can.
    it('returns false for the defender of a request case when the prosecution also appealed', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            defenderNationalId: '1111111111',
            appealCase: {
              appealState: AppealCaseState.APPEALED,
              appealEventLogs: [prosecutorAppealed, defenderAppealed],
            },
          } as unknown as Case,
          defenceUser('1111111111'),
        ),
      ).toBe(false)
    })

    // Prosecution precedence is request-case only: a dismissed indictment appeal
    // is per party, so the defender of an appealing defendant may withdraw even
    // when the prosecution also appealed.
    it('returns true for the confirmed defender of a dismissed indictment even when the prosecution also appealed', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.INDICTMENT,
            defendants: [
              {
                id: 'd-1',
                isDefenderChoiceConfirmed: true,
                defenderNationalId: '1111111111',
              },
            ],
            appealCase: {
              appealState: AppealCaseState.RECEIVED,
              appealEventLogs: [
                prosecutorAppealed,
                {
                  eventType: AppealEventType.APPEALED,
                  userRole: UserRole.DEFENDER,
                  defendantId: 'd-1',
                },
              ],
            },
          } as unknown as Case,
          defenceUser('1111111111'),
        ),
      ).toBe(true)
    })

    it('returns true for the confirmed defender of a defendant who appealed a dismissed indictment', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.INDICTMENT,
            defendants: [
              {
                id: 'd-1',
                isDefenderChoiceConfirmed: true,
                defenderNationalId: '1111111111',
              },
            ],
            appealCase: {
              appealState: AppealCaseState.RECEIVED,
              appealEventLogs: [
                {
                  eventType: AppealEventType.APPEALED,
                  userRole: UserRole.DEFENDER,
                  defendantId: 'd-1',
                },
              ],
            },
          } as unknown as Case,
          defenceUser('1111111111'),
        ),
      ).toBe(true)
    })

    it('returns false for a defender who is not the confirmed defender of the appealing defendant', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.INDICTMENT,
            defendants: [
              {
                id: 'd-1',
                isDefenderChoiceConfirmed: true,
                defenderNationalId: '1111111111',
              },
            ],
            appealCase: {
              appealState: AppealCaseState.RECEIVED,
              appealEventLogs: [
                {
                  eventType: AppealEventType.APPEALED,
                  userRole: UserRole.DEFENDER,
                  defendantId: 'd-1',
                },
              ],
            },
          } as unknown as Case,
          defenceUser('2222222222'),
        ),
      ).toBe(false)
    })

    it('returns false once the appeal has been concluded', () => {
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            defenderNationalId: '1111111111',
            appealCase: {
              appealState: AppealCaseState.COMPLETED,
              appealEventLogs: [defenderAppealed],
            },
          } as unknown as Case,
          defenceUser('1111111111'),
        ),
      ).toBe(false)
    })
  })

  describe('getContextMenuActions', () => {
    it('returns empty list for district court when indictment waiting for cancellation', () => {
      const user = districtCourtJudge('judge-1')
      const theCase = {
        type: CaseType.INDICTMENT,
        state: CaseState.WAITING_FOR_CANCELLATION,
      }
      expect(getContextMenuActions(theCase, user)).toEqual([])
    })

    it('includes DELETE_CASE when prosecution user and case is deletable', () => {
      const user = prosecutionUser('p-1')
      const theCase = {
        type: CaseType.CUSTODY,
        state: CaseState.DRAFT,
      }
      expect(getContextMenuActions(theCase, user)).toContain(
        ContextMenuCaseActionType.DELETE_CASE,
      )
    })

    it('includes WITHDRAW_APPEAL when prosecution the user can cancel appeal', () => {
      const user = prosecutionUser('p-1')
      const theCase = {
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        appealCase: {
          appealState: AppealCaseState.APPEALED,
          appealEventLogs: [
            {
              eventType: AppealEventType.APPEALED,
              userRole: UserRole.PROSECUTOR,
            },
          ],
        },
      } as unknown as Case
      expect(getContextMenuActions(theCase, user)).toContain(
        ContextMenuCaseActionType.WITHDRAW_APPEAL,
      )
    })

    it('includes WITHDRAW_APPEAL when the defence user can cancel appeal', () => {
      const user = defenceUser('1111111111')
      const theCase = {
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        defenderNationalId: '1111111111',
        appealCase: {
          appealState: AppealCaseState.APPEALED,
          appealEventLogs: [
            {
              eventType: AppealEventType.APPEALED,
              userRole: UserRole.DEFENDER,
            },
          ],
        },
      } as unknown as Case
      expect(getContextMenuActions(theCase, user)).toContain(
        ContextMenuCaseActionType.WITHDRAW_APPEAL,
      )
    })
  })
})
