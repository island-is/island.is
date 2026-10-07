import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealEventType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  appellantSideLabel,
  buildAppealSummonsFormSections,
  civilClaimantsForDefendant,
  getEarliestStandingAppealDate,
  getStandingAppealSummonsDefendants,
  isAppealSummonsFormReady,
  prefillAppealSummonsClaims,
  toAppealSummonsDefendantInputs,
} from './AppealSummons.logic'

describe('prefillAppealSummonsClaims', () => {
  const defendant = {
    name: 'Jón Sigurður Jónsson',
    nationalId: '0101303019',
    address: 'Laugavegur 1, Reykjavík',
  }

  it('returns the defence wording', () => {
    expect(
      prefillAppealSummonsClaims(
        AppealSummonsAppellantSide.DEFENCE,
        defendant,
      ),
    ).toContain('Ákærði krefst þess aðallega að hann verði sýknaður')
  })

  it('returns the prosecution wording with defendant details', () => {
    const claims = prefillAppealSummonsClaims(
      AppealSummonsAppellantSide.PROSECUTION,
      defendant,
    )

    expect(claims).toContain(
      'Málinu er áfrýjað gagnvart ákærða, Jón Sigurður Jónsson, kennitala 010130-3019, Laugavegur 1, Reykjavík.',
    )
  })

  it('appends civil claimant lines when present', () => {
    const claims = prefillAppealSummonsClaims(
      AppealSummonsAppellantSide.DEFENCE,
      defendant,
      [{ name: 'Guðrún Jónsdóttir', nationalId: '0101302989' }],
    )

    expect(claims).toContain('Dæmda einkaréttarkröfu á:')
    expect(claims).toContain(
      'Guðrún Jónsdóttir, kennitala 010130-2989, heimilisfang.',
    )
    expect(claims).toContain(
      'Guðrún Jónsdóttir hafði uppi einkaréttarkröfu fyrir héraðsdómi.',
    )
  })

  it('uses the plural civil claimant heading for several claimants', () => {
    expect(
      prefillAppealSummonsClaims(
        AppealSummonsAppellantSide.PROSECUTION,
        defendant,
        [
          { name: 'A', nationalId: '0101303019' },
          { name: 'B', nationalId: '0101302989' },
        ],
      ),
    ).toContain('Dæmdar einkaréttarkröfur eiga:')
  })
})

describe('getStandingAppealSummonsDefendants', () => {
  const theCase = (
    appealEventLogs: NonNullable<
      NonNullable<WorkingCase['verdictAppealCase']>['appealEventLogs']
    >,
    defendants: WorkingCase['defendants'] = [
      {
        id: 'defendant_a',
        name: 'Jón',
        nationalId: '0101303019',
        address: 'Laugavegur 1',
        verdict: { id: 'v1', appealDate: '2026-06-04T00:00:00.000Z' },
      },
      {
        id: 'defendant_b',
        name: 'Guðrún',
        nationalId: '0101302989',
        address: 'Laugavegur 2',
      },
    ],
  ): Pick<WorkingCase, 'defendants' | 'verdictAppealCase'> => ({
    defendants,
    verdictAppealCase: {
      id: 'appeal_id',
      appealEventLogs,
    },
  })

  it('returns a defence row for a standing defence appeal', () => {
    expect(
      getStandingAppealSummonsDefendants(
        theCase([
          {
            id: 'e1',
            created: '2026-06-05T10:00:00.000Z',
            eventType: AppealEventType.APPEALED,
            defendantId: 'defendant_a',
            userRole: UserRole.DEFENDER,
          },
        ]),
      ),
    ).toEqual([
      {
        defendantId: 'defendant_a',
        name: 'Jón',
        nationalId: '0101303019',
        address: 'Laugavegur 1',
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        appealDate: '2026-06-04T00:00:00.000Z',
      },
    ])
  })

  it('uses prosecution wording when both sides stand', () => {
    const [row] = getStandingAppealSummonsDefendants(
      theCase([
        {
          id: 'e1',
          created: '2026-06-04T10:00:00.000Z',
          eventType: AppealEventType.APPEALED,
          defendantId: 'defendant_a',
          userRole: UserRole.DEFENDER,
        },
        {
          id: 'e2',
          created: '2026-06-05T10:00:00.000Z',
          eventType: AppealEventType.APPEALED,
          defendantId: 'defendant_a',
          userRole: UserRole.PROSECUTOR,
        },
      ]),
    )

    expect(row.appellantSide).toBe(AppealSummonsAppellantSide.PROSECUTION)
    expect(row.appealDate).toBe('2026-06-05T10:00:00.000Z')
  })

  it('drops a withdrawn appeal', () => {
    expect(
      getStandingAppealSummonsDefendants(
        theCase([
          {
            id: 'e1',
            created: '2026-06-04T10:00:00.000Z',
            eventType: AppealEventType.APPEALED,
            defendantId: 'defendant_a',
            userRole: UserRole.DEFENDER,
          },
          {
            id: 'e2',
            created: '2026-06-05T10:00:00.000Z',
            eventType: AppealEventType.APPEAL_WITHDRAWN,
            defendantId: 'defendant_a',
            userRole: UserRole.DEFENDER,
          },
        ]),
      ),
    ).toEqual([])
  })

  it('keeps defendant order from the case', () => {
    expect(
      getStandingAppealSummonsDefendants(
        theCase([
          {
            id: 'e2',
            created: '2026-06-05T10:00:00.000Z',
            eventType: AppealEventType.APPEALED,
            defendantId: 'defendant_b',
            userRole: UserRole.PROSECUTOR,
          },
          {
            id: 'e1',
            created: '2026-06-04T10:00:00.000Z',
            eventType: AppealEventType.APPEALED,
            defendantId: 'defendant_a',
            userRole: UserRole.DEFENDER,
          },
        ]),
      ).map((row) => row.defendantId),
    ).toEqual(['defendant_a', 'defendant_b'])
  })
})

describe('getEarliestStandingAppealDate', () => {
  it('returns the earliest date', () => {
    expect(
      getEarliestStandingAppealDate([
        { appealDate: '2026-06-05T00:00:00.000Z' },
        { appealDate: '2026-06-04T00:00:00.000Z' },
      ]),
    ).toBe('2026-06-04T00:00:00.000Z')
  })
})

describe('buildAppealSummonsFormSections', () => {
  const standing = [
    {
      defendantId: 'defendant_a',
      name: 'Jón',
      nationalId: '0101303019',
      address: 'Laugavegur 1',
      appellantSide: AppealSummonsAppellantSide.DEFENCE,
      appealDate: '2026-06-04T00:00:00.000Z',
    },
    {
      defendantId: 'defendant_b',
      name: 'Guðrún',
      nationalId: '0101302989',
      address: 'Laugavegur 2',
      appellantSide: AppealSummonsAppellantSide.PROSECUTION,
      appealDate: '2026-06-05T00:00:00.000Z',
    },
  ]

  it('includes every standing defendant with prefilled claims on issue', () => {
    const sections = buildAppealSummonsFormSections(standing)

    expect(sections).toHaveLength(2)
    expect(sections.every((section) => section.included)).toBe(true)
    expect(sections[0].claims).toContain('Ákærði krefst þess aðallega')
    expect(sections[1].claims).toContain('Málinu er áfrýjað gagnvart ákærða')
  })

  it('marks only existing summons defendants as included on edit', () => {
    const sections = buildAppealSummonsFormSections(standing, [], {
      defendants: [
        {
          id: 'row_id',
          defendantId: 'defendant_b',
          appellantSide: AppealSummonsAppellantSide.PROSECUTION,
          claims: 'Saved claims',
        },
      ],
    })

    expect(sections[0].included).toBe(false)
    expect(sections[1].included).toBe(true)
    expect(sections[1].claims).toBe('Saved claims')
  })

  it('prefills only civil claimants linked to each defendant', () => {
    const sections = buildAppealSummonsFormSections(standing, [
      {
        name: 'Only for Jón',
        nationalId: '0101303019',
        defendantIds: ['defendant_a'],
      },
      {
        name: 'Only for Guðrún',
        nationalId: '0101302989',
        defendantIds: ['defendant_b'],
      },
      {
        name: 'For every defendant',
        nationalId: '0101302399',
        defendantIds: [],
      },
    ])

    expect(sections[0].claims).toContain('Only for Jón')
    expect(sections[0].claims).toContain('For every defendant')
    expect(sections[0].claims).not.toContain('Only for Guðrún')
    expect(sections[1].claims).toContain('Only for Guðrún')
    expect(sections[1].claims).toContain('For every defendant')
    expect(sections[1].claims).not.toContain('Only for Jón')
  })
})

describe('civilClaimantsForDefendant', () => {
  const claimants = [
    { name: 'A', nationalId: '1', defendantIds: ['defendant_a'] },
    { name: 'B', nationalId: '2', defendantIds: ['defendant_b'] },
    { name: 'All empty', nationalId: '3', defendantIds: [] },
    { name: 'All missing', nationalId: '4' },
  ]

  it('keeps claimants for the defendant and those with no defendant link', () => {
    expect(
      civilClaimantsForDefendant(claimants, 'defendant_a').map((c) => c.name),
    ).toEqual(['A', 'All empty', 'All missing'])
  })
})

describe('isAppealSummonsFormReady', () => {
  it('requires at least one included section with non-empty claims', () => {
    expect(
      isAppealSummonsFormReady([
        { included: false, claims: 'x' },
        { included: true, claims: '   ' },
      ]),
    ).toBe(false)

    expect(
      isAppealSummonsFormReady([
        { included: false, claims: 'x' },
        { included: true, claims: 'Kröfur' },
      ]),
    ).toBe(true)
  })
})

describe('toAppealSummonsDefendantInputs', () => {
  it('returns only included sections with trimmed claims', () => {
    expect(
      toAppealSummonsDefendantInputs([
        {
          defendantId: 'a',
          name: 'A',
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: '  one  ',
          included: true,
        },
        {
          defendantId: 'b',
          name: 'B',
          appellantSide: AppealSummonsAppellantSide.PROSECUTION,
          claims: 'two',
          included: false,
        },
      ]),
    ).toEqual([
      {
        defendantId: 'a',
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'one',
      },
    ])
  })
})

describe('appellantSideLabel', () => {
  it('labels each side', () => {
    expect(appellantSideLabel(AppealSummonsAppellantSide.DEFENCE)).toBe(
      'Ákærði áfrýjaði dómi',
    )
    expect(appellantSideLabel(AppealSummonsAppellantSide.PROSECUTION)).toBe(
      'Ákæruvaldið áfrýjaði dómi',
    )
  })
})
