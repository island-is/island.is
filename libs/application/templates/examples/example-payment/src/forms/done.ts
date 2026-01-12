import {
  buildForm,
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'

export const done: Form = buildForm({
  id: 'ExamplePaymentDoneForm',
  title: 'Umsókn móttekin',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'done',
      title: m.step.confirmTitle,
      children: [
        buildDescriptionField({
          id: 'donetext',
          title: 'Búið!',
          description: 'Done done',
        }),
      ],
    }),
  ],
})
