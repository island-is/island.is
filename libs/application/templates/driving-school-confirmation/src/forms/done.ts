import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: m.confirmationComplete,
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'schoolConfirmed',
      title: '',
      component: 'SchoolConfirmed',
    }),
  ],
})
