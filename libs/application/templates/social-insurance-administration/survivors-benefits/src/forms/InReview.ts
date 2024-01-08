import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { survivorsBenefitsFormMessage } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'SurvivorsBenefitsInReview',
  title: survivorsBenefitsFormMessage.shared.applicationTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField({
          id: 'InReview',
          title: '',
          component: 'Review',
        }),
      ],
    }),
  ],
})
