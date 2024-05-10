import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { B_TEMP } from '../shared/constants'

export const done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationDone,
      alertMessage: ({ answers }) =>
        answers.applicationFor === B_TEMP
          ? m.applicationDoneAlertMessage
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableDescription: ({ answers }) =>
        answers.applicationFor === B_TEMP
          ? m.nextStepsDescription
          : m.nextStepsDescriptionBFull,
    }),
  ],
})
