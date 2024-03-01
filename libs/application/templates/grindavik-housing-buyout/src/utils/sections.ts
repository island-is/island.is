import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { inReview } from '../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  alertMessage: inReview.alertMessage,
  expandableDescription: inReview.nextSteps,
  expandableIntro: '',
  bottomButtonLabel: inReview.buttonText,
})
