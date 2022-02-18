import {
  buildForm,
  Form,
  FormModes,
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import * as m from '../lib/messages'

export const done: Form = buildForm({
  id: 'ExamplePaymentDoneForm',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: m.step.externalDataTitle,
      children: [],
    }),
    buildSection({
      id: 'info',
      title: m.step.info,
      children: [],
    }),
    buildSection({
      id: 'awaitingPayment',
      title: m.step.paymentTitle,
      children: [],
    }),
    buildSection({
      id: 'done',
      title: m.step.confirmTitle,
      children: [
        buildDescriptionField({
          id: 'donetext',
          title: 'Búið!',
          description: 'Done done',
        }),
      ],
    }),
  ],
})
