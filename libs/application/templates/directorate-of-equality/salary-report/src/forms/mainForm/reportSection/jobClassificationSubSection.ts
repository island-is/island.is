import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { ProgressPaths } from '../../../utils/constants'

export const jobClassificationSubSection = buildSubSection({
  id: 'jobClassification',
  title: messages.report.jobClassification.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobClassificationMultiField',
      title: messages.report.jobClassification.title,
      description: messages.report.jobClassification.intro,
      children: [
        buildCustomField({
          id: 'roles',
          component: 'JobClassificationEditor',
          // The step's own data lives on the DMR draft, so this marker is the
          // only thing that tells the shell the screen is done — see
          // ProgressPaths. Replaces `doesNotRequireAnswer: true`: a screen that
          // requires no answer is skipped without advancing the resume point.
          childInputIds: [ProgressPaths.jobClassification],
        }),
      ],
    }),
  ],
})
