import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationDone,
      alertMessage: m.applicationDoneAlertMessage,
      expandableHeader: m.nextStepsTitle,
      expandableDescription: m.nextStepsDescription,
    }),
  ],
})
