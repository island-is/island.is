import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { pensionSupplementFormMessage } from '../lib/messages'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'

export const InReview: Form = buildForm({
  id: 'PensionSupplementInReview',
  title: pensionSupplementFormMessage.shared.applicationTitle,
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
