import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const declined: Form = buildForm({
  id: 'declined',
  title: m.applicationDenied,
  mode: FormModes.REJECTED,
  children: [
    buildCustomField({
      id: 'rejected',
      component: 'Declined',
      title: m.applicationDenied,
    }),
  ],
})
