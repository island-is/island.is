import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  DefaultEvents,
  buildSubmitField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const Pending: Form = buildForm({
  id: 'PendingForm',
  title: 'Pending',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'pending',
      title: m.property,
      children: [
        buildCustomField({
          component: 'Pending',
          id: 'Pending',
          title: '',
          description: '',
        }),
      ],
    }),
    buildSection({
      id: 'paymentInfo',
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
