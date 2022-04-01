import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  buildSubSection,
  buildSection,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const PendingRejected: Form = buildForm({
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
        buildSubSection({
          id: 'pending.ticket',
          title: m.requestForProcessing,
          children: [
            buildCustomField({
              component: 'PendingRejected',
              id: 'PendingRejected',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: m.confirmation,
      children: [],
    }),
  ],
})
