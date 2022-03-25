import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  buildCustomField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const PaymentInfo: Form = buildForm({
  id: 'PaymentInfo',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'selectRealEstate',
      title: 'Eign',
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [
        buildMultiField({
          id: 'payment.info',
          title: m.payment,
          space: 1,
          children: [
            buildCustomField({
              id: 'payment.over',
              title: '',
              component: 'OverviewPaymentCharge',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
