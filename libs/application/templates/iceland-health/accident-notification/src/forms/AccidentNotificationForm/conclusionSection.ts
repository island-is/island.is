import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  alertTitle: conclusion.general.alertTitle,
  alertMessage: conclusion.information.title,
  expandableHeader: conclusion.information.title,
  expandableIntro: conclusion.information.description,
  expandableDescription: conclusion.information.bulletList,
})
