import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { socialInsuranceAdministrationMessage as m } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form } from '@island.is/application/types'
import { overviewFields } from '../../utils/overviewFields'

export const InReviewForm: Form = buildForm({
  id: 'disabilityPensionInReview',
  logo: SocialInsuranceAdministrationLogo,
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
