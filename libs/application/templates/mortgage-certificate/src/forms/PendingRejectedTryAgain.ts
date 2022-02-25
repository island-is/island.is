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

export const PendingRejectedTryAgain: Form = buildForm({
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
        buildCustomField({
          component: 'PendingRejectedTryAgain',
          id: 'PendingRejectedTryAgain',
          title: '',
          description: '',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.continue,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.continue,
              type: 'primary',
            },
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
