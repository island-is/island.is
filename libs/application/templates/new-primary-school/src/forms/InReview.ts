import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { inReviewFormMessages } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'inReviewForm',
  title: inReviewFormMessages.formTitle,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField({
          id: 'inReview',
          title: '',
          component: 'Review',
        }),
      ],
    }),
  ],
})
