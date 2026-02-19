import type { User } from '@island.is/judicial-system/types'
import {
  CaseActionType,
  CaseAppealState,
  CaseDecision,
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
  getMatch,
  isMyCase,
  normalizeCaseTypeForDisplay,
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
  describe('getMatch', () => {
    it('returns policeCaseNumbers when query matches one number', () => {
      const theCase = {
        policeCaseNumbers: ['123-2024', '456-2024'],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [],
      } as unknown as Case
      expect(getMatch(theCase, '456')).toEqual({
        field: 'policeCaseNumbers',
        value: '456-2024',
      })
    })

    it('returns courtCaseNumber when query matches', () => {
      const theCase = {
        policeCaseNumbers: ['123-2024'],
        courtCaseNumber: 'R-123/2024',
        appealCaseNumber: null,
        defendants: [],
      } as unknown as Case
      expect(getMatch(theCase, 'R-123')).toEqual({
        field: 'courtCaseNumber',
        value: 'R-123/2024',
      })
    })

    it('returns appealCaseNumber when query matches', () => {
      const theCase = {
        policeCaseNumbers: ['123-2024'],
        courtCaseNumber: null,
        appealCaseNumber: 'S-1/2024',
        defendants: [],
      } as unknown as Case
      expect(getMatch(theCase, 'S-1')).toEqual({
        field: 'appealCaseNumber',
        value: 'S-1/2024',
      })
    })

    it('returns defendantNationalId when query matches', () => {
      const theCase = {
        policeCaseNumbers: ['123-2024'],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [
          { nationalId: '1234567890', name: 'John' },
          { nationalId: '0987654321', name: 'Jane' },
        ],
      } as unknown as Case
      expect(getMatch(theCase, '0987654321')).toEqual({
        field: 'defendantNationalId',
        value: '0987654321',
      })
    })

    it('returns defendantName when query matches', () => {
      const theCase = {
        policeCaseNumbers: ['123-2024'],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [{ nationalId: '1', name: 'Jón Jónsson' }],
      } as unknown as Case
      expect(getMatch(theCase, 'Jónsson')).toEqual({
        field: 'defendantName',
        value: 'Jón Jónsson',
      })
    })

    it('is case-insensitive', () => {
      const theCase = {
        policeCaseNumbers: ['ABC-2024'],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [],
      } as unknown as Case
      expect(getMatch(theCase, 'abc')).toEqual({
        field: 'policeCaseNumbers',
        value: 'ABC-2024',
      })
    })

    it('falls back to first police case number when no field matches', () => {
      const theCase = {
        policeCaseNumbers: ['123-2024'],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [],
      } as unknown as Case
      expect(getMatch(theCase, 'xyz')).toEqual({
        field: 'policeCaseNumbers',
        value: '123-2024',
      })
    })

    it('returns empty string when no police case numbers', () => {
      const theCase = {
        policeCaseNumbers: [],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [],
      } as unknown as Case
      expect(getMatch(theCase, 'xyz')).toEqual({
        field: 'policeCaseNumbers',
        value: '',
      })
    })
  })

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

  describe('normalizeCaseTypeForDisplay', () => {
    it('returns TRAVEL_BAN for CUSTODY with ACCEPTING_ALTERNATIVE_TRAVEL_BAN', () => {
      expect(
        normalizeCaseTypeForDisplay(
          CaseType.CUSTODY,
          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
        ),
      ).toBe(CaseType.TRAVEL_BAN)
    })

    it('returns same type for other decisions', () => {
      expect(
        normalizeCaseTypeForDisplay(CaseType.CUSTODY, CaseDecision.ACCEPTING),
      ).toBe(CaseType.CUSTODY)
      expect(normalizeCaseTypeForDisplay(CaseType.INDICTMENT, undefined)).toBe(
        CaseType.INDICTMENT,
      )
    })
  })
})
