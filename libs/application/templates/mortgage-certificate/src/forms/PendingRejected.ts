import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  DefaultEvents,
  buildSubmitField,
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
      title: 'Eign',
      children: [
        buildSubSection({
          id: 'pending.ticket',
          title: 'Beiðni um vinnslu',
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
      title: 'Greiðsla',
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: 'Staðfesting',
      children: [],
    }),
  ],
})
