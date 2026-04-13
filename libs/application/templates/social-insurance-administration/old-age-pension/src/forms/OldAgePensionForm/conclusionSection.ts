import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { oldAgePensionFormMessage } from '../../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  multiFieldTitle:
    socialInsuranceAdministrationMessage.conclusionScreen.receivedTitle,
  alertTitle: socialInsuranceAdministrationMessage.conclusionScreen.alertTitle,
  alertMessage: oldAgePensionFormMessage.conclusionScreen.alertMessage,
  expandableIntro: oldAgePensionFormMessage.conclusionScreen.expandableIntro,
  expandableDescription:
    oldAgePensionFormMessage.conclusionScreen.expandableDescription,
})
