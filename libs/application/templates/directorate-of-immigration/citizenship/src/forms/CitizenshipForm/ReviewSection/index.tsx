import {
  buildSection,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { review } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'

export const ReviewSection = buildSection({
  id: 'review',
  title: review.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reviewMultiField',
      title: review.general.pageTitle,
      description: review.general.description,
      condition: (application: FormValue, _) => {
        console.log('application', application)
        return true
      },
      space: 1,
      children: [
        buildCustomField({
          id: 'review',
          component: 'Review',
          title: '',
        }),
      ],
    }),
  ],
})
