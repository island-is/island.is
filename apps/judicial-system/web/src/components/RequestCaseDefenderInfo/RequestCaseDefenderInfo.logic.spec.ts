import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  anyDefendantHasDefender,
  buildCaseDefenderMirrorUpdate,
  shouldClearRequestSharedWithDefender,
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

  describe('shouldClearRequestSharedWithDefender', () => {
    const defendants = [
      { id: 'a', defenderName: 'Lögmaður A' },
      { id: 'b', defenderName: 'Lögmaður B' },
    ]

    test('returns false when the next defender name is set', () => {
      expect(
        shouldClearRequestSharedWithDefender({
          defendants,
          editedDefendantId: 'a',
          nextDefenderName: 'Nýr lögmaður',
        }),
      ).toBe(false)
    })

    test('returns false when another defendant still has a defender', () => {
      expect(
        shouldClearRequestSharedWithDefender({
          defendants,
          editedDefendantId: 'a',
          nextDefenderName: null,
        }),
      ).toBe(false)
    })

    test('returns true when the edited defendant is cleared and no other defendant has a defender', () => {
      expect(
        shouldClearRequestSharedWithDefender({
          defendants: [{ id: 'a', defenderName: 'Lögmaður A' }, { id: 'b' }],
          editedDefendantId: 'a',
          nextDefenderName: null,
        }),
      ).toBe(true)
    })

    test('treats an empty string as cleared', () => {
      expect(
        shouldClearRequestSharedWithDefender({
          defendants: [{ id: 'a', defenderName: 'Lögmaður A' }],
          editedDefendantId: 'a',
          nextDefenderName: '',
        }),
      ).toBe(true)
    })

    test('returns true for a single defendant cleared when defendants are undefined', () => {
      expect(
        shouldClearRequestSharedWithDefender({
          defendants: undefined,
          editedDefendantId: 'a',
          nextDefenderName: undefined,
        }),
      ).toBe(true)
    })
  })

  describe('buildCaseDefenderMirrorUpdate', () => {
    const contact = {
      defenderName: 'Lögmaður',
      defenderNationalId: '0101010101',
      defenderEmail: 'logmadur@example.com',
      defenderPhoneNumber: '1234567',
    }

    test('mirrors contact fields with force for a prosecutor', () => {
      expect(
        buildCaseDefenderMirrorUpdate({
          ...contact,
          isCourtUser: false,
          clearSharing: false,
        }),
      ).toEqual({ ...contact, force: true })
    })

    test('sets NOT_SHARED for a court user', () => {
      expect(
        buildCaseDefenderMirrorUpdate({
          ...contact,
          isCourtUser: true,
          clearSharing: false,
        }),
      ).toEqual({
        ...contact,
        requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
        force: true,
      })
    })

    test('clears sharing when requested', () => {
      expect(
        buildCaseDefenderMirrorUpdate({
          defenderName: null,
          defenderNationalId: null,
          defenderEmail: null,
          defenderPhoneNumber: null,
          isCourtUser: false,
          clearSharing: true,
        }),
      ).toEqual({
        defenderName: null,
        defenderNationalId: null,
        defenderEmail: null,
        defenderPhoneNumber: null,
        requestSharedWithDefender: null,
        force: true,
      })
    })

    test('null wins over NOT_SHARED when a court user clears sharing', () => {
      const update = buildCaseDefenderMirrorUpdate({
        ...contact,
        isCourtUser: true,
        clearSharing: true,
      })

      expect(update.requestSharedWithDefender).toBeNull()
    })
  })
})
