import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

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
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
