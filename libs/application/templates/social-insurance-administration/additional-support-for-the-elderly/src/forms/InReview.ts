import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyInReview',
  title: additionalSupportForTheElderyFormMessage.shared.applicationTitle,
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
