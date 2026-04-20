import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { TheIcelandicRecyclingFundLogo } from '@island.is/application/assets/institution-logos'
import { inReviewFormMessages } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'VehiclesInReview',
  title: inReviewFormMessages.formTitle,
  logo: TheIcelandicRecyclingFundLogo,
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
