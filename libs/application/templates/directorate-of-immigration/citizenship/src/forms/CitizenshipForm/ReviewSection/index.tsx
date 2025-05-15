import {
  buildSection,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { review } from '../../../lib/messages'

export const ReviewSection = buildSection({
  id: 'review',
  title: review.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reviewMultiField',
      title: review.general.pageTitle,
      description: review.general.description,
      space: 1,
      children: [
        buildCustomField({
          id: 'review',
          component: 'Review',
        }),
      ],
    }),
  ],
})
