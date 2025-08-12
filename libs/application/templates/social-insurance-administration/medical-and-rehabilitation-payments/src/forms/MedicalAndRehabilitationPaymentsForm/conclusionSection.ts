import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  multiFieldTitle: medicalAndRehabilitationPaymentsFormMessage.conclusion.title,
  alertTitle: medicalAndRehabilitationPaymentsFormMessage.conclusion.alertTitle,
  alertMessage:
    medicalAndRehabilitationPaymentsFormMessage.conclusion.alertMessage,
  expandableIntro: medicalAndRehabilitationPaymentsFormMessage.conclusion.next,
  expandableDescription:
    medicalAndRehabilitationPaymentsFormMessage.conclusion.entitlements,
})
