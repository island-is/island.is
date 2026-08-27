import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

export const inReviewForm = buildForm({
  id: 'inReviewForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildFormConclusionSection({
      sectionTitle: messages.inReview.sectionTitle,
      tabTitle: messages.inReview.sectionTitle,
      alertTitle: messages.inReview.alertTitle,
      expandableIntro: messages.inReview.expandableIntro,
      expandableDescription: messages.inReview.expandableDescription,
    }),
  ],
})
