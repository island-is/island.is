import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildSelectField,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const jobWishesSubSection = buildSubSection({
  id: 'jobWishesSubSection',
  title: employmentSearchMessages.jobWishes.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobWishesSubSection',
      title: employmentSearchMessages.jobWishes.pageTitle,
      children: [
        buildSelectField({
          id: 'jobWishes.jobList',
          title: employmentSearchMessages.jobWishes.employmentListLabel,
          options: (application) => {
            return [
              {
                value: 'jobList',
                label: 'test',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
