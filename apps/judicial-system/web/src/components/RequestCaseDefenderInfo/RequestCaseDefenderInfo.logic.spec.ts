import {
  CaseState,
  RequestSharedWithDefender,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  anyDefendantHasDefender,
  canDefenderViewRequest,
  getDefendantRequestSharingUpdate,
  getRequestCaseDefenderNames,
  getRequestSharedWithDefenderForNationalId,
  isRequestSharingDecidedForAllDefenders,
} from './RequestCaseDefenderInfo.logic'

describe('RequestCaseDefenderInfo.logic', () => {
  describe('anyDefendantHasDefender', () => {
    test('returns false when defendants are undefined', () => {
      expect(anyDefendantHasDefender(undefined)).toBe(false)
    })

    test('returns false when no defendant has a defender name', () => {
      expect(
        anyDefendantHasDefender([
          { id: 'a', defenderName: null },
          { id: 'b', defenderName: '' },
          { id: 'c' },
        ]),
      ).toBe(false)
    })

    test('returns true when some defendant has a defender name', () => {
      expect(
        anyDefendantHasDefender([
          { id: 'a' },
          { id: 'b', defenderName: 'Lögmaður' },
        ]),
      ).toBe(true)
    })
  })

  describe('getRequestCaseDefenderNames', () => {
    test('returns an empty list when defendants are undefined', () => {
      expect(getRequestCaseDefenderNames(undefined)).toEqual([])
    })

    test('skips defendants without a defender name', () => {
      expect(
        getRequestCaseDefenderNames([
          { id: 'a', defenderName: null },
          { id: 'b', defenderName: '' },
          { id: 'c' },
        ]),
      ).toEqual([])
    })

    test('lists the defender of every defendant that has one, in order', () => {
      expect(
        getRequestCaseDefenderNames([
          { id: 'a', defenderName: 'Lögmaður A' },
          { id: 'b' },
          { id: 'c', defenderName: 'Lögmaður C' },
        ]),
      ).toEqual(['Lögmaður A', 'Lögmaður C'])
    })

    test('lists a defender shared by several defendants once', () => {
      expect(
        getRequestCaseDefenderNames([
          { id: 'a', defenderName: 'Lögmaður A' },
          { id: 'b', defenderName: 'Lögmaður A' },
        ]),
      ).toEqual(['Lögmaður A'])
    })
  })

  describe('isRequestSharingDecidedForAllDefenders', () => {
    test('returns true when defendants are undefined', () => {
      expect(isRequestSharingDecidedForAllDefenders(undefined)).toBe(true)
    })

    test('ignores defendants without a defender', () => {
      expect(
        isRequestSharingDecidedForAllDefenders([
          { id: 'a' },
          { id: 'b', defenderName: '' },
        ]),
      ).toBe(true)
    })

    test('returns false when a defendant with a defender has no decision', () => {
      expect(
        isRequestSharingDecidedForAllDefenders([
          {
            id: 'a',
            defenderName: 'Lögmaður A',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
          { id: 'b', defenderName: 'Lögmaður B' },
        ]),
      ).toBe(false)
    })

    test('returns true when every defendant with a defender has a decision', () => {
      expect(
        isRequestSharingDecidedForAllDefenders([
          {
            id: 'a',
            defenderName: 'Lögmaður A',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
          { id: 'b' },
          {
            id: 'c',
            defenderName: 'Lögmaður C',
            requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
          },
        ]),
      ).toBe(true)
    })
  })

  describe('getDefendantRequestSharingUpdate', () => {
    test('leaves sharing alone when a prosecutor sets a defender', () => {
      expect(
        getDefendantRequestSharingUpdate({
          isCourtUser: false,
          nextDefenderName: 'Lögmaður',
        }),
      ).toEqual({})
    })

    test('sets NOT_SHARED when a court user sets a defender', () => {
      expect(
        getDefendantRequestSharingUpdate({
          isCourtUser: true,
          nextDefenderName: 'Lögmaður',
        }),
      ).toEqual({
        requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
      })
    })

    test.each([null, '', undefined])(
      'clears sharing when the defender is removed (%p)',
      (nextDefenderName) => {
        expect(
          getDefendantRequestSharingUpdate({
            isCourtUser: false,
            nextDefenderName,
          }),
        ).toEqual({ requestSharedWithDefender: null })
      },
    )

    test('clearing wins over NOT_SHARED for a court user', () => {
      expect(
        getDefendantRequestSharingUpdate({
          isCourtUser: true,
          nextDefenderName: null,
        }),
      ).toEqual({ requestSharedWithDefender: null })
    })
  })

  describe('getRequestSharedWithDefenderForNationalId', () => {
    const defendants = [
      {
        id: 'a',
        defenderNationalId: '111',
        requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
      },
      {
        id: 'b',
        defenderNationalId: '222',
        requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
      },
      {
        id: 'c',
        defenderNationalId: '111',
        requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
      },
    ]

    test("returns the most permissive sharing among the defender's clients", () => {
      expect(getRequestSharedWithDefenderForNationalId(defendants, '111')).toBe(
        RequestSharedWithDefender.COURT_DATE,
      )
    })

    test("does not fall back to other defendants' sharing", () => {
      expect(
        getRequestSharedWithDefenderForNationalId(defendants, '999'),
      ).toBeNull()
    })
  })

  describe('canDefenderViewRequest', () => {
    const defendants = [
      {
        id: 'a',
        defenderNationalId: '111',
        requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
      },
    ]

    test('allows READY_FOR_COURT once the case is submitted', () => {
      expect(
        canDefenderViewRequest({
          defendants: [
            {
              id: 'a',
              defenderNationalId: '111',
              requestSharedWithDefender:
                RequestSharedWithDefender.READY_FOR_COURT,
            },
          ],
          nationalId: '111',
          state: CaseState.SUBMITTED,
          hasArraignmentDate: false,
        }),
      ).toBe(true)
    })

    test('requires an arraignment date for COURT_DATE sharing only while RECEIVED', () => {
      expect(
        canDefenderViewRequest({
          defendants,
          nationalId: '111',
          state: CaseState.RECEIVED,
          hasArraignmentDate: false,
        }),
      ).toBe(false)

      expect(
        canDefenderViewRequest({
          defendants,
          nationalId: '111',
          state: CaseState.RECEIVED,
          hasArraignmentDate: true,
        }),
      ).toBe(true)

      expect(
        canDefenderViewRequest({
          defendants,
          nationalId: '111',
          state: CaseState.ACCEPTED,
          hasArraignmentDate: false,
        }),
      ).toBe(true)
    })

    test('allows NOT_SHARED only for completed cases', () => {
      const notShared = [
        {
          id: 'a',
          defenderNationalId: '111',
          requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
        },
      ]

      expect(
        canDefenderViewRequest({
          defendants: notShared,
          nationalId: '111',
          state: CaseState.RECEIVED,
          hasArraignmentDate: true,
        }),
      ).toBe(false)

      expect(
        canDefenderViewRequest({
          defendants: notShared,
          nationalId: '111',
          state: CaseState.ACCEPTED,
          hasArraignmentDate: true,
        }),
      ).toBe(true)
    })
  })
})
