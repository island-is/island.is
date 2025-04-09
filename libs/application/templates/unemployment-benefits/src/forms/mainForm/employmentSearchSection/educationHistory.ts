import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const educationHistorySubSection = buildSubSection({
  id: 'educationHistorySubSection',
  title: employmentSearchMessages.educationHistory.sectionTitle,
  children: [
    buildMultiField({
      id: 'educationHistorySubSection',
      title: employmentSearchMessages.educationHistory.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
