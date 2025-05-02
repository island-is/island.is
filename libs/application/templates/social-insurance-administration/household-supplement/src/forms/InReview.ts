import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { inReviewFormMessages } from '../lib/messages'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'

export const InReview: Form = buildForm({
  id: 'HouseholdSupplementInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      children: [
        buildCustomField({
          id: 'InReview',
          component: 'Review',
        }),
      ],
    }),
  ],
})
