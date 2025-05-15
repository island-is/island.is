import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

export const InReview: Form = buildForm({
  id: 'inReviewForm',
  children: [
    buildSection({
      id: 'review',
      children: [
        buildCustomField({
          id: 'inReview',
          component: 'Review',
        }),
      ],
    }),
  ],
})
