import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { completed } from '../../lib/messages/completed'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: completed.general.alertTitle,
      alertMessage: completed.general.alertMessage,
      expandableIntro: completed.general.expandableIntro,
      expandableDescription: '',
    }),
  ],
})
