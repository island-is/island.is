import type { User } from '@island.is/judicial-system/types'
import {
  CaseActionType,
  CaseAppealState,
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

describe('caseTable.utils', () => {
  describe('isMyCase', () => {
    it('returns true for prosecution user when they are creating prosecutor', () => {
      const user = prosecutionUser('user-1')
      const theCase = {
        creatingProsecutorId: 'user-1',
        prosecutorId: 'other',
        judge: null,
        registrar: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns true for prosecution user when they are prosecutor', () => {
      const user = prosecutionUser('user-1')
      const theCase = {
        creatingProsecutorId: 'other',
        prosecutorId: 'user-1',
        judge: null,
        registrar: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns false for prosecution user when neither matches', () => {
      const user = prosecutionUser('user-1')
      const theCase = {
        creatingProsecutorId: 'other',
        prosecutorId: 'other2',
        judge: null,
        registrar: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(false)
    })

    it('returns true for district court user when they are judge', () => {
      const user = districtCourtJudge('judge-1')
      const theCase = {
        creatingProsecutorId: null,
        prosecutorId: null,
        judge: { id: 'judge-1' },
        registrar: null,
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns true for district court user when they are registrar', () => {
      const user = districtCourtJudge('reg-1')
      const theCase = {
        creatingProsecutorId: null,
        prosecutorId: null,
        judge: null,
        registrar: { id: 'reg-1' },
      } as unknown as Case
      expect(isMyCase(theCase, user)).toBe(true)
    })

    it('returns false for district court user when neither matches', () => {
      const user = districtCourtJudge('user-1')
      const theCase = {
        creatingProsecutorId: null,
        prosecutorId: null,
        judge: { id: 'other' },
        registrar: { id: 'other2' },
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
    it('returns false for non-prosecution user', () => {
      const user = districtCourtJudge('judge-1')
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealState: CaseAppealState.APPEALED,
            prosecutorPostponedAppealDate: new Date('2024-01-01'),
          },
          user,
        ),
      ).toBe(false)
    })

    it('returns false for indictment case', () => {
      const user = prosecutionUser('p-1')
      expect(
        canCancelAppeal(
          {
            type: CaseType.INDICTMENT,
            appealState: CaseAppealState.APPEALED,
            prosecutorPostponedAppealDate: new Date('2024-01-01'),
          },
          user,
        ),
      ).toBe(false)
    })

    it('returns true when prosecution, request case, appealed and has postponed date', () => {
      const user = prosecutionUser('p-1')
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealState: CaseAppealState.APPEALED,
            prosecutorPostponedAppealDate: new Date('2024-01-01'),
          },
          user,
        ),
      ).toBe(true)
    })

    it('returns true for RECEIVED appeal state', () => {
      const user = prosecutionUser('p-1')
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealState: CaseAppealState.RECEIVED,
            prosecutorPostponedAppealDate: new Date('2024-01-01'),
          },
          user,
        ),
      ).toBe(true)
    })

    it('returns false when no prosecutorPostponedAppealDate', () => {
      const user = prosecutionUser('p-1')
      expect(
        canCancelAppeal(
          {
            type: CaseType.CUSTODY,
            appealState: CaseAppealState.APPEALED,
            prosecutorPostponedAppealDate: undefined,
          },
          user,
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

    it('includes WITHDRAW_APPEAL when prosecution user can cancel appeal', () => {
      const user = prosecutionUser('p-1')
      const theCase = {
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        appealState: CaseAppealState.APPEALED,
        prosecutorPostponedAppealDate: '2024-01-01',
      } as unknown as Case
      expect(getContextMenuActions(theCase, user)).toContain(
        ContextMenuCaseActionType.WITHDRAW_APPEAL,
      )
    })
  })
})
