import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { completedForm as messages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  title: messages.alertTitle,
  children: [
    buildFormConclusionSection({
      alertMessage: messages.alertMessage,
    }),
  ],
})
