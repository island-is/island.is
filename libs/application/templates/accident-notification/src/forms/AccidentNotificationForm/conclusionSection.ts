import { formConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'

export const conclusionSection = formConclusionSection({
  alertTitle: conclusion.general.alertTitle,
  alertMessage: conclusion.information.title,
  expandableHeader: conclusion.information.title,
  expandableIntro: conclusion.information.description,
  expandableDescription: conclusion.information.bulletList,
})
