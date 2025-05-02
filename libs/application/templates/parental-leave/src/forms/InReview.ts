import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { inReviewFormMessages } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      children: [
        buildCustomField({
          id: 'InReviewSteps',
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
