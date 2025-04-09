import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const resumeSubSection = buildSubSection({
  id: 'resumeSubSection',
  title: employmentSearchMessages.resume.sectionTitle,
  children: [
    buildMultiField({
      id: 'resumeSubSection',
      title: employmentSearchMessages.resume.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
