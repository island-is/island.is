import type { Case, CivilClaimant, Defendant } from '../../repository'
import {
  appealStatementDeadlineGrantedBody,
  appealStatementDeadlineOthersBody,
  appealStatementDeadlineSubject,
  describeAppealStatementDeadlineParty,
  getAppealStatementDeadlineRecipients,
} from './appealStatementDeadline'

const theCase = {
  appealProsecutor: { name: 'Sækjandi Sækjandason', email: 'saksoknari@x.is' },
  defendants: [
    {
      id: 'd1',
      name: 'Gervimaður Jónsson',
      isAppealDefenderConfirmed: true,
      appealDefenderName: 'Lára Lögmann',
      appealDefenderEmail: 'lara@x.is',
    },
    // Confirmed to have no defender: nobody to write to.
    {
      id: 'd2',
      name: 'Annar Ákærði',
      isAppealDefenderConfirmed: true,
      isAppealDefenderWaived: true,
    },
    // Named but not yet confirmed by the court.
    {
      id: 'd3',
      name: 'Þriðji Ákærði',
      appealDefenderName: 'Óstaðfestur Lögmaður',
      appealDefenderEmail: 'ostadfestur@x.is',
    },
  ] as Defendant[],
  civilClaimants: [
    {
      id: 'c1',
      name: 'Fyrsti Kröfuhafi',
      isAppealSpokespersonConfirmed: true,
      appealSpokespersonIsLawyer: false,
      appealSpokespersonName: 'Rétta Gæsla',
      appealSpokespersonEmail: 'retta@x.is',
    },
    {
      id: 'c2',
      name: 'Annar Kröfuhafi',
      isAppealSpokespersonConfirmed: true,
      appealSpokespersonIsLawyer: true,
      appealSpokespersonName: 'Lögi Lögmaður',
      appealSpokespersonEmail: 'logi@x.is',
    },
    // Confirmed, but the court recorded no address.
    {
      id: 'c3',
      name: 'Þriðji Kröfuhafi',
      isAppealSpokespersonConfirmed: true,
      appealSpokespersonName: 'Enginn Póstur',
    },
  ] as CivilClaimant[],
} as Case

describe('getAppealStatementDeadlineRecipients', () => {
  it('lists the prosecutor and every confirmed advocate with an address', () => {
    expect(
      getAppealStatementDeadlineRecipients(theCase).map((recipient) => [
        recipient.role,
        recipient.email,
        recipient.party,
        recipient.side,
      ]),
    ).toEqual([
      ['saksóknari', 'saksoknari@x.is', {}, 'PROSECUTION'],
      ['verjandi', 'lara@x.is', { defendantId: 'd1' }, 'DEFENCE'],
      ['réttargæslumaður', 'retta@x.is', { civilClaimantId: 'c1' }, 'DEFENCE'],
      ['lögmaður', 'logi@x.is', { civilClaimantId: 'c2' }, 'DEFENCE'],
    ])
  })

  it('lists nobody for a case with no prosecutor and no parties', () => {
    expect(getAppealStatementDeadlineRecipients({} as Case)).toEqual([])
  })
})

describe('describeAppealStatementDeadlineParty', () => {
  const recipients = getAppealStatementDeadlineRecipients(theCase)

  it('names the advocate by name and role', () => {
    expect(
      describeAppealStatementDeadlineParty(
        theCase,
        { defendantId: 'd1' },
        recipients,
      ),
    ).toBe('Lára Lögmann verjandi')
    expect(
      describeAppealStatementDeadlineParty(
        theCase,
        { civilClaimantId: 'c2' },
        recipients,
      ),
    ).toBe('Lögi Lögmaður lögmaður')
    expect(describeAppealStatementDeadlineParty(theCase, {}, recipients)).toBe(
      'Sækjandi Sækjandason saksóknari',
    )
  })

  // A party without an advocate to name is named itself.
  it('names the party when it has no advocate', () => {
    expect(
      describeAppealStatementDeadlineParty(
        theCase,
        { defendantId: 'd2' },
        recipients,
      ),
    ).toBe('Ákærði Annar Ákærði')
    expect(
      describeAppealStatementDeadlineParty(
        theCase,
        { civilClaimantId: 'c3' },
        recipients,
      ),
    ).toBe('Bótakröfuhafi Þriðji Kröfuhafi')
    expect(
      describeAppealStatementDeadlineParty(
        { ...theCase, appealProsecutor: undefined } as Case,
        {},
        getAppealStatementDeadlineRecipients({
          ...theCase,
          appealProsecutor: undefined,
        } as Case),
      ),
    ).toBe('Ákæruvaldið')
  })
})

describe('appealStatementDeadlineSubject', () => {
  it('says whether the deadline is new or extended', () => {
    expect(appealStatementDeadlineSubject(false, '77/2026')).toBe(
      'Landsréttur - greinargerðarfrestur í máli 77/2026',
    )
    expect(appealStatementDeadlineSubject(true, '77/2026')).toBe(
      'Landsréttur - framlengdur greinargerðarfrestur í máli 77/2026',
    )
  })

  // The same placeholder the letter of appointment and the advocate mail use.
  it('stands a placeholder in for a number not yet recorded', () => {
    expect(appealStatementDeadlineSubject(false, null)).toContain(
      'í máli xxx/xxxx',
    )
  })
})

describe('the bodies', () => {
  const params = {
    appealCaseNumber: '77/2026',
    deadline: '2026-10-20T00:00:00.000Z',
    link: 'https://rvg.is/akaera/yfirlit/case-id',
  }

  it('tells the party it has time, as the product owner wrote it', () => {
    expect(
      appealStatementDeadlineGrantedBody({ ...params, extended: false }),
    ).toBe(
      'Landsréttur hefur veitt þér frest til að skila greinargerð vegna máls nr. 77/2026.<br/>' +
        'Frestur til 20. október 2026.<br/><br/>' +
        '<a href="https://rvg.is/akaera/yfirlit/case-id">Sjá nánar á yfirlitssíðu málsins í Réttarvörslugátt.</a>',
    )
  })

  it('tells the party it has more time', () => {
    expect(
      appealStatementDeadlineGrantedBody({
        ...params,
        extended: true,
        deadline: '2026-10-27T00:00:00.000Z',
      }),
    ).toContain(
      'Landsréttur hefur veitt þér aukinn frest til að skila greinargerð vegna máls nr. 77/2026.<br/>Frestur til 27. október 2026.',
    )
  })

  it('tells the others who got the time', () => {
    expect(
      appealStatementDeadlineOthersBody({
        ...params,
        extended: false,
        who: 'Lára Lögmann verjandi',
      }),
    ).toBe(
      'Lára Lögmann verjandi hefur fengið frest til að skila greinargerð vegna máls nr. 77/2026. Frestur til 20. október 2026.<br/><br/>' +
        '<a href="https://rvg.is/akaera/yfirlit/case-id">Sjá nánar á yfirlitssíðu málsins í Réttarvörslugátt.</a>',
    )
    expect(
      appealStatementDeadlineOthersBody({
        ...params,
        extended: true,
        who: 'Lára Lögmann verjandi',
      }),
    ).toContain('hefur fengið aukinn frest til að skila greinargerð')
  })

  // Each body carries its own link, so the base service adds no tail.
  it('carries the link itself', () => {
    expect(
      appealStatementDeadlineGrantedBody({ ...params, extended: false }),
    ).toContain('<a href=')
  })
})
