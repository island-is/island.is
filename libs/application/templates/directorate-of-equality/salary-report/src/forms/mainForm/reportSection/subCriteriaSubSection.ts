import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { ProgressPaths } from '../../../utils/constants'

export const subCriteriaSubSection = buildSubSection({
  id: 'subCriteria',
  title: messages.report.subCriteria.sectionTitle,
  children: [
    buildMultiField({
      id: 'subCriteriaMultiField',
      title: messages.report.subCriteria.title,
      children: [
        buildCustomField({
          id: 'subCriteria',
          component: 'SubCriteriaEditor',
          // The step's own data lives on the DMR draft, so this marker is the
          // only thing that tells the shell the screen is done — see
          // ProgressPaths. Replaces `doesNotRequireAnswer: true`: a screen that
          // requires no answer is skipped without advancing the resume point.
          childInputIds: [ProgressPaths.subCriteria],
        }),
      ],
    }),
  ],
})
