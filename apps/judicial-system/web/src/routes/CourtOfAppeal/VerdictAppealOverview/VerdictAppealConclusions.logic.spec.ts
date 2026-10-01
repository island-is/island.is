import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'

import { getVerdictAppealConclusions } from './VerdictAppealConclusions.logic'

type ConclusionCase = Pick<
  WorkingCase,
  'courtSessions' | 'indictmentRulingDecision' | 'judge' | 'verdictAppealCase'
>

const caseWith = (overrides: Partial<ConclusionCase>): ConclusionCase =>
  ({
    courtSessions: [],
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    judge: null,
    verdictAppealCase: null,
    ...overrides,
  } as ConclusionCase)

describe('getVerdictAppealConclusions', () => {
  it('has nothing to show before either court has concluded', () => {
    expect(getVerdictAppealConclusions(caseWith({}))).toEqual([])
  })

  // For an indictment the words live on the last court session, not on the
  // case, and a case can have more than one session.
  it('takes the district court words from the last court session', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          courtSessions: [
            { ruling: 'Fyrra þinghald' },
            { ruling: 'Ákærði sæti fangelsi í 12 mánuði.' },
          ],
          judge: { name: 'Kristín Gunnarsdóttir' },
        } as Partial<ConclusionCase>),
      ),
    ).toEqual([
      {
        id: 'district-court-conclusion',
        title: 'Dómsorð héraðsdóms',
        text: 'Ákærði sæti fangelsi í 12 mánuði.',
        signedBy: ['Kristín Gunnarsdóttir'],
      },
    ])
  })

  // A case completed without a verdict was ruled on, not judged, and the
  // heading has to say so.
  it('titles a ruling as a ruling', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          courtSessions: [{ ruling: 'Máli þessu er vísað frá dómi.' }],
        } as Partial<ConclusionCase>),
      )[0].title,
    ).toBe('Úrskurðarorð héraðsdóms')
  })

  // The panel reads in the same order the info cards name it, and a seat that
  // was never filled is left out rather than shown as an empty name.
  it('names the court of appeals panel in Icelandic alphabetical order', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          verdictAppealCase: {
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
            appealJudge1: { name: 'Jón Höskuldsson' },
            appealJudge2: { name: 'Ásgeir Magnússon' },
            appealJudge3: { name: 'Hildur Briem' },
          },
        } as Partial<ConclusionCase>),
      ),
    ).toEqual([
      {
        id: 'court-of-appeals-conclusion',
        title: 'Dómsorð Landsréttar',
        text: 'Hinn áfrýjaði dómur skal vera óraskaður.',
        signedBy: ['Ásgeir Magnússon', 'Hildur Briem', 'Jón Höskuldsson'],
      },
    ])
  })

  it('leaves out a judge seat that was never filled', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          verdictAppealCase: {
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
            appealJudge1: { name: 'Ásgeir Magnússon' },
          },
        } as Partial<ConclusionCase>),
      )[0].signedBy,
    ).toEqual(['Ásgeir Magnússon'])
  })

  // Read side by side, district court first - the order the proceeding went in.
  it('puts the district court first when both have concluded', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          courtSessions: [{ ruling: 'Ákærði sæti fangelsi í 12 mánuði.' }],
          verdictAppealCase: {
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
          },
        } as Partial<ConclusionCase>),
      ).map((conclusion) => conclusion.title),
    ).toEqual(['Dómsorð héraðsdóms', 'Dómsorð Landsréttar'])
  })
})
