import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationCompleteAlertTitle,
      alertMessage: m.applicationCompleteAlertMessage,
    }),
  ],
})
