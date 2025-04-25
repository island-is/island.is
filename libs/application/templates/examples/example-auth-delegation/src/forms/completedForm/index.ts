import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'

export const completedForm = buildForm({
  id: 'CompletedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: 'Congratulations',
      alertMessage: 'You have completed this auth delegation application',
    }),
  ],
})
