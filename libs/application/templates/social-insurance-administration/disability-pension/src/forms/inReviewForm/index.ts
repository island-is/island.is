import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { socialInsuranceAdministrationMessage as m } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form } from '@island.is/application/types'
import { overviewFields } from '../../utils/overviewFields'

export const InReviewForm: Form = buildForm({
  id: 'disabilityPensionInReview',
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      tabTitle: m.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'inReviewOverviewScreen',
          title: m.confirm.overviewTitle,
          children: [...overviewFields(false)],
        }),
      ],
    }),
  ],
})
