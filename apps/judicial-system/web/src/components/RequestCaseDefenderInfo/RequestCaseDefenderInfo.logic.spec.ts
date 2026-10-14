import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  anyDefendantHasDefender,
  buildCaseDefenderMirrorUpdate,
  getDefendantRequestSharingUpdate,
  getRequestCaseDefenderNames,
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

  describe('buildCaseDefenderMirrorUpdate', () => {
    const contact = {
      defenderName: 'Lögmaður',
      defenderNationalId: '0101010101',
      defenderEmail: 'logmadur@example.com',
      defenderPhoneNumber: '1234567',
    }

    test('mirrors contact fields with force', () => {
      expect(buildCaseDefenderMirrorUpdate(contact)).toEqual({
        ...contact,
        force: true,
      })
    })

    test('never writes the case-level sharing timing', () => {
      expect(buildCaseDefenderMirrorUpdate(contact)).not.toHaveProperty(
        'requestSharedWithDefender',
      )
    })
  })
})
