import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { confirmation as confirmationMessages } from '../../lib/messages'
import { FormModes } from '@island.is/application/types'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: confirmationMessages.alertTitle,
      expandableHeader: confirmationMessages.accordionTitle,
      expandableDescription: confirmationMessages.accordionText,
    }),
  ],
})
