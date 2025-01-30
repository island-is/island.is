import { conclusion } from '../../../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const conclusionSection = buildFormConclusionSection({
  alertTitle: conclusion.general.alertTitle,
  alertMessage: conclusion.general.alertMessageFreshman,
  expandableHeader: conclusion.general.accordionTitle,
  expandableIntro: '',
  expandableDescription: conclusion.general.accordionTextFreshman,
})
