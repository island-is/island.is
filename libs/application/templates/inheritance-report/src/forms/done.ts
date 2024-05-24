import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'inheritanceReportDone',
  title: '',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: '',
      alertTitle: '',
      alertMessage: '',
      expandableHeader: '',
      expandableDescription: '',
    }),
  ],
})
