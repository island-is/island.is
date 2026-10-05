import type {
  CivilClaimant,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  areAllAppealAdvocatesConfirmed,
  getAppealDefender,
  getAppealSpokesperson,
  getAppealSpokespersonIsLawyer,
  getHasAppealSpokesperson,
} from './VerdictAppealDefender.logic'

const defendantWith = (overrides: Partial<Defendant>): Defendant =>
  ({
    id: 'defendant-id',
    name: 'Jón Sigurður Jónsson',
    ...overrides,
  } as Defendant)

const claimantWith = (overrides: Partial<CivilClaimant>): CivilClaimant =>
  ({ id: 'claimant-id', name: 'Bótakröfuhafi', ...overrides } as CivilClaimant)

describe('getAppealDefender', () => {
  it('finds nobody when neither proceeding has named one', () => {
    expect(getAppealDefender(defendantWith({}))).toEqual({
      name: undefined,
      nationalId: undefined,
      email: undefined,
      phoneNumber: undefined,
    })
  })

  // Nothing has been recorded for the appeal yet, so the court starts from
  // whoever defended at the district court.
  it('falls back to the defender of record', () => {
    expect(
      getAppealDefender(
        defendantWith({
          defenderName: 'Lára Lögmann',
          defenderNationalId: '0000000000',
          defenderEmail: 'lara@lawyers.is',
          defenderPhoneNumber: '5555555',
        }),
      ),
    ).toEqual({
      name: 'Lára Lögmann',
      nationalId: '0000000000',
      email: 'lara@lawyers.is',
      phoneNumber: '5555555',
    })
  })

  // The office registered a different defender when the appeal arrived by
  // letter. That one is about this proceeding, so it wins.
  it('prefers the defender the appeal names', () => {
    expect(
      getAppealDefender(
        defendantWith({
          defenderName: 'Lára Lögmann',
          defenderNationalId: '0000000000',
          appealDefenderName: 'Brynjar Sveinsson',
          appealDefenderNationalId: '1111111111',
        }),
      ),
    ).toEqual({
      name: 'Brynjar Sveinsson',
      nationalId: '1111111111',
      email: undefined,
      phoneNumber: undefined,
    })
  })

  // Waiving counsel clears the appeal fields, and reading the district court
  // through after that would show a defender beside a checked "wants no
  // counsel" box - and hand the court that name to confirm.
  it('names nobody once the defendant has waived counsel', () => {
    expect(
      getAppealDefender(
        defendantWith({
          defenderName: 'Lára Lögmann',
          defenderEmail: 'lara@lawyers.is',
          appealDefenderWaived: true,
        }),
      ),
    ).toEqual({
      name: undefined,
      nationalId: undefined,
      email: undefined,
      phoneNumber: undefined,
    })
  })

  // Unchecking the box is an answer too. The court has engaged with the
  // question, so it names the defender rather than being handed a guess.
  it('stops reading through once the question has been answered either way', () => {
    expect(
      getAppealDefender(
        defendantWith({
          defenderName: 'Lára Lögmann',
          appealDefenderWaived: false,
        }),
      ).name,
    ).toBeUndefined()
  })

  // A half-filled appeal record is still the appeal's answer - reading the
  // missing half off the district court would blend two people into one.
  it('does not mix the two records', () => {
    expect(
      getAppealDefender(
        defendantWith({
          defenderName: 'Lára Lögmann',
          defenderEmail: 'lara@lawyers.is',
          appealDefenderName: 'Brynjar Sveinsson',
        }),
      ).email,
    ).toBeUndefined()
  })
})

describe('getAppealSpokesperson', () => {
  it('falls back to the district court advocate', () => {
    expect(
      getAppealSpokesperson(
        claimantWith({
          spokespersonName: 'Lára Lögmann',
          spokespersonEmail: 'lara@lawyers.is',
        }),
      ).name,
    ).toBe('Lára Lögmann')
  })

  it('prefers the one the appeal names', () => {
    expect(
      getAppealSpokesperson(
        claimantWith({
          spokespersonName: 'Lára Lögmann',
          appealSpokespersonName: 'Brynjar Sveinsson',
        }),
      ).name,
    ).toBe('Brynjar Sveinsson')
  })

  // Removing the advocate and adding one again is the trap: the fields are
  // cleared both times, so reading through would put the district court's
  // advocate back on screen for the court to confirm by accident.
  it('names nobody after this court has cleared the advocate', () => {
    expect(
      getAppealSpokesperson(
        claimantWith({
          hasSpokesperson: true,
          spokespersonName: 'Lára Lögmann',
          hasAppealSpokesperson: false,
        }),
      ).name,
    ).toBeUndefined()
  })

  it('still names nobody when one is added again', () => {
    expect(
      getAppealSpokesperson(
        claimantWith({
          hasSpokesperson: true,
          spokespersonName: 'Lára Lögmann',
          hasAppealSpokesperson: true,
        }),
      ).name,
    ).toBeUndefined()
  })
})

describe('getHasAppealSpokesperson', () => {
  it('starts from the district court answer', () => {
    expect(
      getHasAppealSpokesperson(claimantWith({ hasSpokesperson: true })),
    ).toBe(true)
    expect(
      getHasAppealSpokesperson(claimantWith({ hasSpokesperson: false })),
    ).toBe(false)
  })

  // Once this court has answered, its answer stands - including the answer
  // that reverses the district court's.
  it('lets this court reverse it', () => {
    expect(
      getHasAppealSpokesperson(
        claimantWith({ hasSpokesperson: true, hasAppealSpokesperson: false }),
      ),
    ).toBe(false)
    expect(
      getHasAppealSpokesperson(
        claimantWith({ hasSpokesperson: false, hasAppealSpokesperson: true }),
      ),
    ).toBe(true)
  })

  it('treats an unanswered claimant as unrepresented', () => {
    expect(getHasAppealSpokesperson(claimantWith({}))).toBe(false)
  })
})

describe('getAppealSpokespersonIsLawyer', () => {
  // The kind of advocate is cleared alongside the name, and has to stay
  // cleared for the same reason.
  it('forgets the district court kind once the advocate is cleared', () => {
    expect(
      getAppealSpokespersonIsLawyer(
        claimantWith({
          spokespersonIsLawyer: true,
          hasAppealSpokesperson: true,
        }),
      ),
    ).toBeUndefined()
  })

  it('starts from the district court answer and lets this court reverse it', () => {
    expect(
      getAppealSpokespersonIsLawyer(
        claimantWith({ spokespersonIsLawyer: true }),
      ),
    ).toBe(true)
    expect(
      getAppealSpokespersonIsLawyer(
        claimantWith({
          spokespersonIsLawyer: true,
          appealSpokespersonIsLawyer: false,
        }),
      ),
    ).toBe(false)
  })
})

describe('areAllAppealAdvocatesConfirmed', () => {
  it('is satisfied by a case with nobody on it', () => {
    expect(areAllAppealAdvocatesConfirmed({})).toBe(true)
  })

  it('waits for every defendant', () => {
    expect(
      areAllAppealAdvocatesConfirmed({
        defendants: [
          defendantWith({ isAppealDefenderConfirmed: true }),
          defendantWith({ isAppealDefenderConfirmed: false }),
        ],
      }),
    ).toBe(false)
  })

  // A claimant this court says is to have no advocate has nothing left to
  // confirm, so the step is not held open on their account.
  it('does not wait for a claimant who is to have no advocate', () => {
    expect(
      areAllAppealAdvocatesConfirmed({
        defendants: [defendantWith({ isAppealDefenderConfirmed: true })],
        civilClaimants: [
          claimantWith({ hasSpokesperson: true, hasAppealSpokesperson: false }),
        ],
      }),
    ).toBe(true)
  })

  it('waits for a claimant who is to have one', () => {
    expect(
      areAllAppealAdvocatesConfirmed({
        defendants: [defendantWith({ isAppealDefenderConfirmed: true })],
        civilClaimants: [claimantWith({ hasAppealSpokesperson: true })],
      }),
    ).toBe(false)
  })

  // Declining counsel is still a decision to be confirmed - the record has to
  // say the court settled it, not that nobody got round to it.
  it('still waits for a defendant who wants no counsel', () => {
    expect(
      areAllAppealAdvocatesConfirmed({
        defendants: [defendantWith({ appealDefenderWaived: true })],
      }),
    ).toBe(false)
  })
})
