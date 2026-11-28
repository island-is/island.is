import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  sectionTitle: conclusion.general.sectionTitle,
  multiFieldTitle: conclusion.general.pageTitle,
  alertTitle: conclusion.general.alertTitle,
  alertMessage: '',
  expandableHeader: conclusion.general.accordionTitle,
  expandableIntro: '',
  expandableDescription: conclusion.general.accordionText,
})
