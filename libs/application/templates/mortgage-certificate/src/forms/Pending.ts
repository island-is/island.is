import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  DefaultEvents,
  buildSubmitField,
  buildSection,
  buildDescriptionField,
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
      title: 'Eign',
      children: [
        buildCustomField({
          id: 'pendingComponent',
          title: '',
          description: '',
          component: 'Pending',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.continue,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.continue,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'paymentInfo',
      title: 'Greiðsla',
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesting',
      children: [],
    }),
  ],
})
