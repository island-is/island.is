import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [buildFormConclusionSection({})],
})
