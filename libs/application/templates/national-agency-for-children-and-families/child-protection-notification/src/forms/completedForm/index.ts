import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: 'Congratulations',
      alertMessage: 'You have completed this boilerplate application',
    }),
  ],
})
