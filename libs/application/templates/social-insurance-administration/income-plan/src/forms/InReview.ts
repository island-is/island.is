import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { inReviewFormMessages } from '../lib/messages'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'

export const InReview: Form = buildForm({
  id: 'IncomePlanInReview',
  title: inReviewFormMessages.formTitle,
  logo: SocialInsuranceAdministrationLogo,
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
