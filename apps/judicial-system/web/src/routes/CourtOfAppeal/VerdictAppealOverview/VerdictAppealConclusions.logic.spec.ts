import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  AppealCaseState,
  AppealCaseType,
  AppealRulingType,
  CaseIndictmentRulingDecision,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
            verdictAppealStatus: VerdictAppealStatus.COMPLETED,
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
            appealJudges: [
              { displayOrder: 0, user: { name: 'Jón Höskuldsson' } },
              { displayOrder: 1, user: { name: 'Ásgeir Magnússon' } },
              { displayOrder: 2, user: { name: 'Hildur Briem' } },
            ],
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

  it('titles the court of appeals words for a ruling when it ended with one', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          verdictAppealCase: {
            verdictAppealStatus: VerdictAppealStatus.COMPLETED,
            appealRulingType: AppealRulingType.RULING,
            appealConclusion: 'Málinu er vísað frá Landsrétti.',
          },
        } as Partial<ConclusionCase>),
      )[0].title,
    ).toBe('Úrskurðarorð Landsréttar')
  })

  it('leaves out a judge seat that was never filled', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          verdictAppealCase: {
            verdictAppealStatus: VerdictAppealStatus.COMPLETED,
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
            appealJudges: [
              { displayOrder: 0, user: { name: 'Ásgeir Magnússon' } },
            ],
          },
        } as Partial<ConclusionCase>),
      )[0].signedBy,
    ).toEqual(['Ásgeir Magnússon'])
  })

  // Words recorded under "Lokið" stay on record when the status is moved away
  // from it. The district court's words are shown regardless.
  it('leaves out the court of appeals words while the appeal is not marked finished', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          courtSessions: [{ ruling: 'Ákærði sæti fangelsi í 12 mánuði.' }],
          verdictAppealCase: {
            appealState: AppealCaseState.APPEALED,
            verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
          },
        } as Partial<ConclusionCase>),
      ).map((conclusion) => conclusion.title),
    ).toEqual(['Dómsorð héraðsdóms'])
  })

  it.each([AppealCaseState.READY_TO_COMPLETE, AppealCaseState.COMPLETED])(
    'keeps the court of appeals words of a %s appeal under another status',
    (appealState) => {
      expect(
        getVerdictAppealConclusions(
          caseWith({
            verdictAppealCase: {
              appealType: AppealCaseType.VERDICT,
              appealState,
              verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
              appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
            },
          } as Partial<ConclusionCase>),
        ).map((conclusion) => conclusion.title),
      ).toEqual(['Dómsorð Landsréttar'])
    },
  )

  // Read side by side, district court first - the order the proceeding went in.
  it('puts the district court first when both have concluded', () => {
    expect(
      getVerdictAppealConclusions(
        caseWith({
          courtSessions: [{ ruling: 'Ákærði sæti fangelsi í 12 mánuði.' }],
          verdictAppealCase: {
            verdictAppealStatus: VerdictAppealStatus.COMPLETED,
            appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
          },
        } as Partial<ConclusionCase>),
      ).map((conclusion) => conclusion.title),
    ).toEqual(['Dómsorð héraðsdóms', 'Dómsorð Landsréttar'])
  })
})
