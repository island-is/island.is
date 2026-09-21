import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { ProgressPaths } from '../../../utils/constants'

export const dataEntrySubSection = buildSubSection({
  id: 'dataEntry',
  title: messages.report.dataEntry.sectionTitle,
  children: [
    buildMultiField({
      id: 'dataEntryMultiField',
      title: messages.report.dataEntry.title,
      description: messages.report.dataEntry.intro,
      children: [
        buildCustomField({
          id: 'dataEntry.excelTemplateDownload',
          component: 'ExcelTemplateDownload',
          // The step's own data lives on the DMR draft, so this marker is the
          // only thing that tells the shell the screen is done — see
          // ProgressPaths. Replaces `doesNotRequireAnswer: true`: a screen that
          // requires no answer is skipped without advancing the resume point.
          childInputIds: [ProgressPaths.dataEntry],
        }),
      ],
    }),
  ],
})
