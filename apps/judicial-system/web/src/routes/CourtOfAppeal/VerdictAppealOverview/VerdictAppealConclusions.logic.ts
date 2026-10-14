import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { sortByIcelandicAlphabet } from '@island.is/judicial-system-web/src/utils/sortHelper'

export interface VerdictAppealConclusion {
  id: string
  title: string
  text: string
  /** Who signed it, already in the order they are shown. */
  signedBy: string[]
}

/**
 * The district court's own words, which for an indictment live on the last
 * court session rather than on the case, titled for what was decided - the
 * same way the district court's own completed view titles them.
 */
export const getDistrictCourtConclusion = (
  theCase: Pick<
    WorkingCase,
    'courtSessions' | 'indictmentRulingDecision' | 'judge'
  >,
): VerdictAppealConclusion | undefined => {
  const text = theCase.courtSessions?.at(-1)?.ruling

  if (!text) {
    return undefined
  }

  return {
    id: 'district-court-conclusion',
    title: `${
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
        ? 'Dóms'
        : 'Úrskurðar'
    }orð héraðsdóms`,
    text,
    signedBy: theCase.judge?.name ? [theCase.judge.name] : [],
  }
}

/**
 * What this court decided, once it has decided it. Nothing writes an appeal
 * conclusion for a verdict appeal yet, so in practice this is absent until the
 * step that does is built - which is why it is left out rather than shown
 * empty.
 *
 * The panel is named in the same order the info cards name it, so the court
 * reads the same three names in the same sequence wherever they appear.
 */
export const getCourtOfAppealsConclusion = (
  theCase: Pick<WorkingCase, 'verdictAppealCase'>,
): VerdictAppealConclusion | undefined => {
  const appeal = theCase.verdictAppealCase
  const text = appeal?.appealConclusion

  if (!text) {
    return undefined
  }

  return {
    id: 'court-of-appeals-conclusion',
    title: 'Dómsorð Landsréttar',
    text,
    signedBy: sortByIcelandicAlphabet(
      [
        appeal?.appealJudge1?.name,
        appeal?.appealJudge2?.name,
        appeal?.appealJudge3?.name,
      ].filter((name): name is string => Boolean(name)),
    ),
  }
}

export const getVerdictAppealConclusions = (
  theCase: Pick<
    WorkingCase,
    'courtSessions' | 'indictmentRulingDecision' | 'judge' | 'verdictAppealCase'
  >,
): VerdictAppealConclusion[] =>
  [
    getDistrictCourtConclusion(theCase),
    getCourtOfAppealsConclusion(theCase),
  ].filter(
    (conclusion): conclusion is VerdictAppealConclusion =>
      conclusion !== undefined,
  )
