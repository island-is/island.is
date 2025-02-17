import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { deathBenefitsFormMessage } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'DeathBenefitsInReview',
  title: deathBenefitsFormMessage.shared.applicationTitle,
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
