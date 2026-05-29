import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { completedForm as completedFormMessages } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: DirectorateOfLabourLogo,
  children: [
    buildFormConclusionSection({
      alertTitle: completedFormMessages.alertTitle,
      multiFieldTitle: completedFormMessages.multiFieldTitle,
      alertMessage: '',
      descriptionFieldTitle: completedFormMessages.descriptionFieldTitle,
      descriptionFieldDescription:
        completedFormMessages.descriptionFieldDescription,
      accordion: false,
      bottomButtonLabel: completedFormMessages.bottomButtonLabel,
      bottomButtonMessage: completedFormMessages.bottomButtonMessage,
    }),
  ],
})
