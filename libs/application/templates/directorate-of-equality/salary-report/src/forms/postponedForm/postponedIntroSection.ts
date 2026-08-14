import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'
import {
  isOutlierGroupComplete,
  OutlierGroupAnswer,
} from '../../utils/outlierGroups'

export const postponedIntroSection = buildSection({
  id: 'postponedIntro',
  title: messages.postponed.introSectionTitle,
  condition: (answers, externalData) => {
    // hasComments is what actually keeps this hidden for a case-worker-
    // requested revision (IN_REVIEW's EDIT event retargets here): the
    // external report-workflow service always posts a comment with a
    // mandatory reason before dispatching EDIT, so hasComments is guaranteed
    // true by the time that path lands in POSTPONED. That invariant is
    // enforced outside this repo (dmr.is directorate-of-equality-api's
    // sendToEdit) and isn't type-checked here — if it's ever loosened, this
    // intro (with its "you chose to postpone" copy) would wrongly show to an
    // applicant sent back for revision.
    //
    // outlierPlanComplete is NOT a reliable signal for "this is a revision
    // re-entry" — DRAFT can transition straight to IN_REVIEW without ever
    // visiting POSTPONED (e.g. no outliers detected), so a first-ever
    // outlier plan can still be incomplete going into a revision pass. It's
    // kept here only to also skip the intro for the genuine first-time
    // postpone case once the applicant has actually filled the plan in.
    const hasComments =
      ((getValueViaPath(
        externalData,
        'getReportComments.data',
      ) as unknown[]) ?? []).length > 0
    const outlierGroups =
      getValueViaPath<OutlierGroupAnswer[]>(
        answers,
        'salaryAnalysis.outlierGroups',
      ) ?? []
    const outlierPlanComplete =
      outlierGroups.length > 0 && outlierGroups.every(isOutlierGroupComplete)
    return !hasComments && !outlierPlanComplete
  },
  children: [
    buildMultiField({
      id: 'postponedIntroMultiField',
      title: messages.postponed.introTitle,
      children: [
        buildDescriptionField({
          id: 'postponedIntroDescription',
          description: messages.postponed.introDescription,
        }),
      ],
    }),
  ],
})
