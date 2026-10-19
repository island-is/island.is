import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealEventType,
  type AppealStatementDeadline,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  applyStatementDeadline,
  canSendStatementDeadline,
  getStatementDeadlineActionLabel,
  getStatementDeadlineConfirmation,
  getStatementDeadlineMinDate,
  getStatementDeadlineParties,
  getStatementDeadlineStatusLabel,
} from './VerdictAppealStatementDeadlines.logic'

const theCase = {
  defendants: [{ id: 'd1', name: 'Gervimaður Jónsson' }],
  civilClaimants: [
    { id: 'c1', name: 'Fyrsti Kröfuhafi' },
    { id: 'c2', name: 'Annar Kröfuhafi' },
  ],
  appealProsecutor: { id: 'p1', name: 'Sækjandi Sækjandason' },
  verdictAppealCase: {
    id: 'appeal',
    statementDeadlines: [
      { id: 'sd1', defendantId: 'd1', deadline: '2026-10-12T00:00:00.000Z' },
      { id: 'sd2', deadline: '2026-10-20T00:00:00.000Z' },
    ],
    appealEventLogs: [
      {
        id: 'e1',
        eventType: AppealEventType.APPEAL_STATEMENT_SENT,
        defendantId: 'd1',
      },
      {
        id: 'e2',
        eventType: AppealEventType.ADVOCATE_CONFIRMED,
        civilClaimantId: 'c1',
      },
    ],
  },
} as unknown as WorkingCase

describe('getStatementDeadlineParties', () => {
  it('lists the accused, then the prosecution, then every claimant', () => {
    expect(
      getStatementDeadlineParties(theCase).map((party) => [
        party.roleLabel,
        party.name,
      ]),
    ).toEqual([
      ['Ákærði', 'Gervimaður Jónsson'],
      ['Ákæruvaldið', 'Sækjandi Sækjandason'],
      ['Bótakröfuhafi', 'Fyrsti Kröfuhafi'],
      ['Bótakröfuhafi', 'Annar Kröfuhafi'],
    ])
  })

  it('gives each party its own row in the appeal', () => {
    const [defendant, prosecution, claimant] =
      getStatementDeadlineParties(theCase)

    expect(defendant.party).toEqual({ defendantId: 'd1' })
    expect(prosecution.party).toEqual({})
    expect(claimant.party).toEqual({ civilClaimantId: 'c1' })
  })

  it("reads each party its own deadline and nobody else's", () => {
    const [defendant, prosecution, claimant] =
      getStatementDeadlineParties(theCase)

    expect(defendant.deadline).toBe('2026-10-12T00:00:00.000Z')
    expect(prosecution.deadline).toBe('2026-10-20T00:00:00.000Z')
    expect(claimant.deadline).toBeUndefined()
  })

  // Only a statement-sent event counts, and only the party's own.
  it('marks the party whose statement is in', () => {
    const [defendant, prosecution, claimant] =
      getStatementDeadlineParties(theCase)

    expect(defendant.hasFiledStatement).toBe(true)
    expect(prosecution.hasFiledStatement).toBe(false)
    expect(claimant.hasFiledStatement).toBe(false)
  })

  // A party without an advocate, or a prosecution nobody has been assigned
  // to, is still listed (owner's decision); there is just no name to show.
  it('lists the prosecution with no name when no appeal prosecutor is assigned', () => {
    const [, prosecution] = getStatementDeadlineParties({
      ...theCase,
      appealProsecutor: undefined,
    })

    expect(prosecution.name).toBe('')
  })

  it('lists nothing but the prosecution for a case without parties', () => {
    expect(
      getStatementDeadlineParties({
        verdictAppealCase: { id: 'appeal' },
      } as WorkingCase).map((party) => party.roleLabel),
    ).toEqual(['Ákæruvaldið'])
  })
})

describe('getStatementDeadlineStatusLabel', () => {
  it('names the role and whether the statement is in', () => {
    expect(
      getStatementDeadlineStatusLabel({
        roleLabel: 'Ákærði',
        hasFiledStatement: true,
      }),
    ).toBe('Ákærði - Greinargerð skilað')
    expect(
      getStatementDeadlineStatusLabel({
        roleLabel: 'Bótakröfuhafi',
        hasFiledStatement: false,
      }),
    ).toBe('Bótakröfuhafi - Greinargerð ekki skilað')
  })
})

describe('getStatementDeadlineActionLabel', () => {
  it('sends a first deadline and extends one that stands', () => {
    expect(getStatementDeadlineActionLabel({})).toBe('Senda frest')
    expect(
      getStatementDeadlineActionLabel({ deadline: '2026-10-12T00:00:00.000Z' }),
    ).toBe('Framlengja frest')
  })
})

describe('canSendStatementDeadline', () => {
  const standing = {
    deadline: '2026-10-12T00:00:00.000Z',
    hasFiledStatement: false,
  }

  it('needs a date', () => {
    expect(
      canSendStatementDeadline({ hasFiledStatement: false }, undefined),
    ).toBe(false)
    expect(
      canSendStatementDeadline(
        { hasFiledStatement: false },
        new Date('2026-10-12T00:00:00.000Z'),
      ),
    ).toBe(true)
  })

  // The same rule the backend enforces, so the button never offers what the
  // request would refuse.
  it('extends only to a later day', () => {
    expect(
      canSendStatementDeadline(standing, new Date('2026-10-13T00:00:00.000Z')),
    ).toBe(true)
    expect(
      canSendStatementDeadline(standing, new Date('2026-10-12T00:00:00.000Z')),
    ).toBe(false)
    expect(
      canSendStatementDeadline(standing, new Date('2026-10-06T00:00:00.000Z')),
    ).toBe(false)
  })

  it('sends nothing once the statement is in', () => {
    expect(
      canSendStatementDeadline(
        { ...standing, hasFiledStatement: true },
        new Date('2026-10-13T00:00:00.000Z'),
      ),
    ).toBe(false)
  })
})

describe('getStatementDeadlineMinDate', () => {
  const today = new Date(2026, 9, 19, 14, 30)

  it('offers from today for a first deadline', () => {
    expect(getStatementDeadlineMinDate({}, today)).toEqual(
      new Date(2026, 9, 19),
    )
  })

  it('offers from the day after a deadline that stands', () => {
    expect(
      getStatementDeadlineMinDate(
        { deadline: new Date(2026, 10, 2).toISOString() },
        today,
      ),
    ).toEqual(new Date(2026, 10, 3))
  })

  // A deadline already passed cannot be extended into the past either.
  it('never offers a day before today', () => {
    expect(
      getStatementDeadlineMinDate(
        { deadline: new Date(2026, 9, 1).toISOString() },
        today,
      ),
    ).toEqual(new Date(2026, 9, 19))
  })
})

describe('getStatementDeadlineConfirmation', () => {
  const pickedDate = new Date(2026, 8, 15)

  it('names the accused and the day for a first deadline', () => {
    expect(
      getStatementDeadlineConfirmation(
        { role: 'DEFENDANT', roleLabel: 'Ákærði', name: 'Gervimaður Jónsson' },
        pickedDate,
      ),
    ).toEqual({
      title: 'Viltu senda út greinargerðarfrest?',
      lines: [
        'Ákærði Gervimaður Jónsson fær frest til að senda inn greinargerð.',
        'Frestur til: 15. september 2026.',
        'Aðilar máls fá tilkynningu um frestinn.',
      ],
    })
  })

  it('words an extension as more time', () => {
    const { title, lines } = getStatementDeadlineConfirmation(
      {
        role: 'CIVIL_CLAIMANT',
        roleLabel: 'Bótakröfuhafi',
        name: 'Fyrsti Kröfuhafi',
        deadline: '2026-09-08T00:00:00.000Z',
      },
      pickedDate,
    )

    expect(title).toBe('Viltu framlengja greinargerðarfrest?')
    expect(lines[0]).toBe(
      'Bótakröfuhafi Fyrsti Kröfuhafi fær aukinn frest til að senda inn greinargerð.',
    )
  })

  // The prosecution is a side, not a person, so the prosecutor is not named.
  it('does not name the prosecutor', () => {
    const { lines } = getStatementDeadlineConfirmation(
      {
        role: 'PROSECUTION',
        roleLabel: 'Ákæruvaldið',
        name: 'Sækjandi Sækjandason',
      },
      pickedDate,
    )

    expect(lines[0]).toBe('Ákæruvaldið fær frest til að senda inn greinargerð.')
  })
})

describe('applyStatementDeadline', () => {
  const saved = {
    id: 'sd1',
    defendantId: 'd1',
    deadline: '2026-10-19T00:00:00.000Z',
  } as AppealStatementDeadline

  it('replaces the row of the party that was extended', () => {
    const result = applyStatementDeadline(theCase, saved)

    expect(result.verdictAppealCase?.statementDeadlines).toEqual([
      saved,
      { id: 'sd2', deadline: '2026-10-20T00:00:00.000Z' },
    ])
  })

  it('adds the row of a party given its first deadline', () => {
    const added = {
      id: 'sd3',
      civilClaimantId: 'c1',
      deadline: '2026-10-19T00:00:00.000Z',
    } as AppealStatementDeadline

    expect(
      applyStatementDeadline(theCase, added).verdictAppealCase
        ?.statementDeadlines,
    ).toHaveLength(3)
  })

  it('leaves a case without a verdict appeal alone', () => {
    const noAppeal = { id: 'case' } as WorkingCase

    expect(applyStatementDeadline(noAppeal, saved)).toBe(noAppeal)
  })
})
