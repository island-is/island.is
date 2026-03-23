import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form } from '@island.is/application/types'
import { overviewFields } from '../utils/overviewFields'

export const InReview: Form = buildForm({
  id: 'MedicalAndRehabilitationInReview',
  logo: SocialInsuranceAdministrationLogo,
  children: [
    buildSection({
      id: 'review',
      tabTitle: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'inReviewOverviewScreen',
          title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
          children: [...overviewFields(false)],
        }),
      ],
    }),
  ],
})
