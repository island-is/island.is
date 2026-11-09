import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { applicationMessages as m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: m.completionTitle,
      tabTitle: m.completionTitle,
      multiFieldTitle: m.completionTitle,
      alertTitle: m.completionAlertTitle,
      alertMessage: m.completionAlertMessage,
      expandableHeader: m.completionNextStepsTitle,
      expandableIntro: m.completionNextStepsIntro,
      expandableDescription: m.completionNextStepsDescription,
      descriptionFieldTitle: m.completionHelpTitle,
      descriptionFieldDescription: m.completionHelpDescription,
      bottomButtonLink: '/minarsidur',
      bottomButtonLabel: m.completionContinueButton,
      bottomButtonMessage: m.completionBottomMessage,
    }),
  ],
})
