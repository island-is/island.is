import { appealRuling } from '@island.is/judicial-system-web/messages'
import {
  AppealCaseRulingDecision,
  AppealRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'

/**
 * The outcomes the court chooses between, in the order it reads them on a
 * ruling appeal: a verdict appeal ends in the same ones.
 */
export const appealRulingDecisionOptions: {
  decision: AppealCaseRulingDecision
  label: string
}[] = [
  {
    decision: AppealCaseRulingDecision.ACCEPTING,
    label: appealRuling.decisionAccept,
  },
  {
    decision: AppealCaseRulingDecision.REPEAL,
    label: appealRuling.decisionRepeal,
  },
  {
    decision: AppealCaseRulingDecision.CHANGED,
    label: appealRuling.decisionChanged,
  },
  {
    decision: AppealCaseRulingDecision.CHANGED_SIGNIFICANTLY,
    label: appealRuling.decisionChangedSignificantly,
  },
  {
    decision: AppealCaseRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL,
    label: appealRuling.decisionDismissedFromCourtOfAppeal,
  },
  {
    decision: AppealCaseRulingDecision.DISMISSED_FROM_COURT,
    label: appealRuling.decisionDismissedFromCourt,
  },
  {
    decision: AppealCaseRulingDecision.REMAND,
    label: appealRuling.decisionRemand,
  },
  {
    decision: AppealCaseRulingDecision.DISCONTINUED,
    label: appealRuling.decisionDiscontinued,
  },
]

export const appealRulingTypeLabels: Record<AppealRulingType, string> = {
  [AppealRulingType.VERDICT]: 'Dómur',
  [AppealRulingType.RULING]: 'Úrskurður',
}

export interface AppealRulingTypeWording {
  /** The court's concluding words, as a field: "Dómsorð". */
  conclusion: string
  conclusionPlaceholder: string
  /** The same words named for the court that spoke them. */
  courtConclusion: string
  /** The document itself: "Dómur Landsréttar". */
  document: string
}

const verdictWording: AppealRulingTypeWording = {
  conclusion: 'Dómsorð',
  conclusionPlaceholder: 'Hvert er dómsorð Landsréttar?',
  courtConclusion: 'Dómsorð Landsréttar',
  document: 'Dómur Landsréttar',
}

const rulingWording: AppealRulingTypeWording = {
  conclusion: 'Úrskurðarorð',
  conclusionPlaceholder: 'Hvert er úrskurðarorð Landsréttar?',
  courtConclusion: 'Úrskurðarorð Landsréttar',
  document: 'Úrskurður Landsréttar',
}

/**
 * How a verdict appeal's outcome is worded, which follows from whether the
 * court ends it with a verdict or with a ruling. Until the court has said
 * which, it is worded as a verdict - what an appeal of a verdict usually ends
 * in, and what the form saves with the first outcome the court picks.
 */
export const getAppealRulingTypeWording = (
  appealRulingType?: AppealRulingType | null,
): AppealRulingTypeWording =>
  appealRulingType === AppealRulingType.RULING ? rulingWording : verdictWording
