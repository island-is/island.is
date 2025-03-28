import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: 'You just state transferred from state DRAFT to COMPLETED',
      alertMessage:
        "Now you are in the COMPLETED state. This state doesn't have any actions or an 'on' object. This means that this state is a dead end, the application is unable to state transfer out of this state.",
      alertType: 'success',
      accordion: false,
      sectionTitle: '',
      descriptionFieldDescription: m.hnippNote,
    }),
  ],
})
