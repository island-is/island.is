import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { reviewConfirmation } from '../../../lib/messages'

export const ConclusionSection = buildFormConclusionSection({
  sectionTitle: reviewConfirmation.general.sectionTitle,
  multiFieldTitle: reviewConfirmation.general.sectionTitle,
  alertTitle: reviewConfirmation.general.alertTitle,
  alertMessage: '',
  expandableHeader: reviewConfirmation.general.accordionTitle,
  expandableIntro: '',
  expandableDescription: reviewConfirmation.general.accordionText,
  bottomButtonMessage: reviewConfirmation.general.bottomButtonMessage,
})
