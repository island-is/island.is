import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { ProgressPaths, ScreenIds } from '../../../utils/constants'

// Criteria live on the DMR draft (see CriteriaEditor), not applicationAnswers.
export const criteriaSubSection = buildSubSection({
  id: 'criteria',
  title: messages.report.criteria.sectionTitle,
  children: [
    buildMultiField({
      id: ScreenIds.criteria,
      title: messages.report.criteria.title,
      description: messages.report.criteria.intro,
      children: [
        buildCustomField({
          id: 'criteria',
          component: 'CriteriaEditor',
          // The step's own data lives on the DMR draft, so this marker is the
          // only thing that tells the shell the screen is done — see
          // ProgressPaths. Replaces `doesNotRequireAnswer: true`: a screen that
          // requires no answer is skipped without advancing the resume point.
          childInputIds: [ProgressPaths.criteria],
        }),
      ],
    }),
  ],
})
