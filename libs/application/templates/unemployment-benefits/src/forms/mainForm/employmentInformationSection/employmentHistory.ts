import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const employmentHistorySubSection = buildSubSection({
  id: 'employmentHistorySubSection',
  title: 'employmentHistorySubSection',
  children: [
    buildMultiField({
      id: 'employmentHistorySubSection',
      title: employmentMessages.employmentHistory.pageTitle,
      description: employmentMessages.employmentHistory.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
