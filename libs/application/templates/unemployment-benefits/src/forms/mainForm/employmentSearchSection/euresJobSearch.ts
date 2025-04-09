import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const euresJobSearchSubSection = buildSubSection({
  id: 'euresJobSearchSubSection',
  title: employmentSearchMessages.euresJobSearch.sectionTitle,
  children: [
    buildMultiField({
      id: 'euresJobSearchSubSection',
      title: employmentSearchMessages.euresJobSearch.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
