import {
  type AppealStatementParty,
  findAppealStatementDeadline,
  hasFiledAppealStatement,
  isSameAppealStatementParty,
} from './appealStatementDeadline'
import { AppealEventType } from './eventLog'

describe('isSameAppealStatementParty', () => {
  it('matches a defendant to itself', () => {
    expect(
      isSameAppealStatementParty(
        { defendantId: 'd1' },
        { defendantId: 'd1', civilClaimantId: null },
      ),
    ).toBe(true)
  })

  it('tells two defendants apart', () => {
    expect(
      isSameAppealStatementParty({ defendantId: 'd1' }, { defendantId: 'd2' }),
    ).toBe(false)
  })

  it('tells a defendant from a civil claimant', () => {
    expect(
      isSameAppealStatementParty(
        { defendantId: 'd1' },
        { civilClaimantId: 'd1' },
      ),
    ).toBe(false)
  })

  // The prosecution is the party nobody is named for, whether the ids are
  // missing, undefined or null.
  it('matches the prosecution however its empty ids are spelled', () => {
    expect(
      isSameAppealStatementParty(
        {},
        { defendantId: null, civilClaimantId: undefined },
      ),
    ).toBe(true)
  })

  it('tells the prosecution from a defendant', () => {
    expect(isSameAppealStatementParty({}, { defendantId: 'd1' })).toBe(false)
  })
})

describe('findAppealStatementDeadline', () => {
  type Deadline = AppealStatementParty & { id: string }

  const defendantDeadline: Deadline = { id: '1', defendantId: 'd1' }
  const claimantDeadline: Deadline = { id: '2', civilClaimantId: 'c1' }
  const prosecutionDeadline: Deadline = { id: '3' }
  const deadlines = [defendantDeadline, claimantDeadline, prosecutionDeadline]

  it('finds the row of each party', () => {
    expect(findAppealStatementDeadline(deadlines, { defendantId: 'd1' })).toBe(
      defendantDeadline,
    )
    expect(
      findAppealStatementDeadline(deadlines, { civilClaimantId: 'c1' }),
    ).toBe(claimantDeadline)
    expect(findAppealStatementDeadline(deadlines, {})).toBe(prosecutionDeadline)
  })

  it('finds nothing for a party without a row', () => {
    expect(
      findAppealStatementDeadline(deadlines, { defendantId: 'd2' }),
    ).toBeUndefined()
    expect(findAppealStatementDeadline(undefined, {})).toBeUndefined()
  })
})

describe('hasFiledAppealStatement', () => {
  const filed = {
    eventType: AppealEventType.APPEAL_STATEMENT_SENT,
    defendantId: 'd1',
  }
  const confirmed = {
    eventType: AppealEventType.ADVOCATE_CONFIRMED,
    defendantId: 'd2',
  }

  it('is true for the party whose statement was sent', () => {
    expect(
      hasFiledAppealStatement([filed, confirmed], { defendantId: 'd1' }),
    ).toBe(true)
  })

  it('does not count another event on the party', () => {
    expect(
      hasFiledAppealStatement([filed, confirmed], { defendantId: 'd2' }),
    ).toBe(false)
  })

  it('does not count another party filing', () => {
    expect(hasFiledAppealStatement([filed], {})).toBe(false)
  })

  it('is false without any events', () => {
    expect(hasFiledAppealStatement(undefined, { defendantId: 'd1' })).toBe(
      false,
    )
  })
})
