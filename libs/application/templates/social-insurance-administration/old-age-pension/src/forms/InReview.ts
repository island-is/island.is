import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { inReviewFormMessages } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'OldAgePensionInReview',
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
