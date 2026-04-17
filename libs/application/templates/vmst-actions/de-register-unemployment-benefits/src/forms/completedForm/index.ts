import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { completedForm as completedFormMessages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: completedFormMessages.alertTitle,
      expandableHeader: completedFormMessages.expandableHeader,
      expandableDescription: completedFormMessages.expandableDescription,
      descriptionFieldTitle: completedFormMessages.descriptionFieldTitle,
      descriptionFieldDescription:
        completedFormMessages.descriptionFieldDescription,
    }),
  ],
})
