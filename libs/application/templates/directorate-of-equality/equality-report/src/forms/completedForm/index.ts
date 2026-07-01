import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { messages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  title: messages.completed.sectionTitle,
  children: [
    buildFormConclusionSection({
      alertTitle: messages.completed.alertTitle,
      alertMessage: messages.completed.alertDescription,
    }),
  ],
})
