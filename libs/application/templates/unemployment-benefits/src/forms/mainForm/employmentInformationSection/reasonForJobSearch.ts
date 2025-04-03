import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const reasonForJobSearchSubSection = buildSubSection({
  id: 'reasonForJobSearchSubSection',
  title: 'reasonForJobSearchSubSection',
  children: [
    buildMultiField({
      id: 'reasonForJobSearchSubSection',
      title: employmentMessages.reasonForJobSearch.pageTitle,
      description: employmentMessages.reasonForJobSearch.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
