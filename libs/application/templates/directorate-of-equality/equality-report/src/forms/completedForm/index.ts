import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: CoatOfArms,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: messages.completed.sectionTitle,
      tabTitle: messages.completed.sectionTitle,
      alertTitle: messages.completed.alertTitle,
      alertMessage: messages.completed.alertDescription,
    }),
  ],
})
