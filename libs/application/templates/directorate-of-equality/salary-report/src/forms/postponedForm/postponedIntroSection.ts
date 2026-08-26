import { getValueViaPath } from '@island.is/application/core'
import { messages } from '../../lib/messages'
import {
  isOutlierGroupComplete,
  OutlierGroupAnswer,
} from '../../utils/outlierGroups'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const postponedIntroSection = buildFormConclusionSection({
  sectionTitle: messages.postponed.sectionTitle,
  tabTitle: messages.postponed.sectionTitle,
  alertTitle: messages.postponed.alertTitle,
  expandableIntro: messages.postponed.expandableIntro,
  expandableDescription: messages.postponed.expandableDescription,

  condition: (answers) => {
    // EDIT no longer ever targets POSTPONED (both IN_REVIEW's and
    // POSTPONED's own EDIT now target DRAFT_RETRY instead), so POSTPONED is
    // exclusively the genuine first-time-postpone path — no revision-re-entry
    // signal is needed here any more. This only skips the intro once the
    // applicant has actually filled the plan in.
    const outlierGroups =
      getValueViaPath<OutlierGroupAnswer[]>(
        answers,
        'salaryAnalysis.outlierGroups',
      ) ?? []
    const outlierPlanComplete =
      outlierGroups.length > 0 && outlierGroups.every(isOutlierGroupComplete)
    return !outlierPlanComplete
  },
})
