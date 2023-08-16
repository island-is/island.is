import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      id: 'done',
      title: m.overviewDone,
      children: [
        buildCustomField({
          id: 'overview',
          component: 'Congratulations',
          title: m.overviewDone,
        }),
      ],
    }),
  ],
})
