import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Lokið',
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'overview',
      component: 'Congratulations',
      title: m.overviewDone,
    }),
  ],
})
