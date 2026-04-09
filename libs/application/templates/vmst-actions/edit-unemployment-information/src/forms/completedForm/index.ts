import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: applicationMessages.completedFormAlertTitle,
      alertMessage: '',
      accordion: false,
      descriptionFieldTitle:
        applicationMessages.completedFormDescriptionFieldTitle,
      descriptionFieldDescription:
        applicationMessages.completedFormDescriptionFieldDescription,
    }),
  ],
})
