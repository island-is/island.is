import {
  buildForm,
  buildCustomField,
  buildSubSection,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const PendingRejected: Form = buildForm({
  id: 'PendingForm',
  title: 'Pending',
  mode: FormModes.IN_PROGRESS,
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
