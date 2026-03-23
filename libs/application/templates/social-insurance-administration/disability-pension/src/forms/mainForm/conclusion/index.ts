import * as m from '../../../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const conclusionSection = buildFormConclusionSection({
  multiFieldTitle: m.confirmation.title,
  alertTitle: m.confirmation.successTitle,
  alertMessage: m.confirmation.successDescription,
  expandableIntro: m.confirmation.whatHappensNextOptions,
  expandableDescription: m.confirmation.warningDescription,
})
