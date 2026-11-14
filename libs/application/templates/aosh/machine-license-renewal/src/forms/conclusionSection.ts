import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  sectionTitle: conclusion.general.sectionTitle,
  multiFieldTitle: conclusion.general.title,
  alertTitle: conclusion.general.alertTitle,
  alertMessage: undefined,
  expandableHeader: conclusion.general.expandableHeader,
  expandableIntro: '',
  expandableDescription: conclusion.general.expandableDescription,
})
