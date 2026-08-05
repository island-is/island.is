import {
  getAvailableDefendantsForCivilClaimant,
  isCivilClaimantDefendantSelectionValid,
} from './civilClaimantUtils'

describe('civilClaimantUtils', () => {
  const defendants = [
    {
      id: 'defendant-1',
      name: 'Defendant One',
      policeCaseNumbers: ['007-2024-000001'],
    },
    {
      id: 'defendant-2',
      name: 'Defendant Two',
      policeCaseNumbers: ['007-2024-000002'],
    },
  ]

  describe('getAvailableDefendantsForCivilClaimant', () => {
    test('returns no defendants when no police case numbers are selected', () => {
      expect(
        getAvailableDefendantsForCivilClaimant(
          { policeCaseNumbers: [] },
          defendants,
        ),
      ).toEqual([])
    })

    test('returns defendants linked to selected police case numbers', () => {
      expect(
        getAvailableDefendantsForCivilClaimant(
          { policeCaseNumbers: ['007-2024-000001', '007-2024-000099'] },
          defendants,
        ),
      ).toEqual([defendants[0]])
    })

    test('returns no defendants when only unassigned police case numbers are selected', () => {
      expect(
        getAvailableDefendantsForCivilClaimant(
          { policeCaseNumbers: ['007-2024-000099'] },
          defendants,
        ),
      ).toEqual([])
    })
  })

  describe('isCivilClaimantDefendantSelectionValid', () => {
    test('is valid without defendant selection when only unassigned police case numbers are selected', () => {
      expect(
        isCivilClaimantDefendantSelectionValid(
          {
            policeCaseNumbers: ['007-2024-000099'],
            defendantIds: [],
          },
          defendants,
        ),
      ).toBe(true)
    })

    test('is invalid when defendant selection is required but empty', () => {
      expect(
        isCivilClaimantDefendantSelectionValid(
          {
            policeCaseNumbers: ['007-2024-000001'],
            defendantIds: [],
          },
          defendants,
        ),
      ).toBe(false)
    })

    test('is valid when at least one available defendant is selected', () => {
      expect(
        isCivilClaimantDefendantSelectionValid(
          {
            policeCaseNumbers: ['007-2024-000001'],
            defendantIds: ['defendant-1'],
          },
          defendants,
        ),
      ).toBe(true)
    })

    test('is invalid when defendantIds only contain stale or unavailable IDs', () => {
      expect(
        isCivilClaimantDefendantSelectionValid(
          {
            policeCaseNumbers: ['007-2024-000001'],
            defendantIds: ['defendant-2', 'deleted-defendant'],
          },
          defendants,
        ),
      ).toBe(false)
    })
  })
})
