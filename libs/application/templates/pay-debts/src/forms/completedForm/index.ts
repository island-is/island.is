import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { completedForm as messages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: messages.alertTitle,
      alertTitle: messages.alertMessage,
      alertMessage: 'Takk fyrir',
    }),
  ],
})
