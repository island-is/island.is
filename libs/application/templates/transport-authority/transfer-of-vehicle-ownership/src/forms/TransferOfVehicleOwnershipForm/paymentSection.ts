import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { payment } from '../../lib/messages'
import { m } from '../../lib/messagess'

export const paymentSection = buildSection({
  id: 'payment',
  title: payment.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentMultiField',
      title: payment.general.pageTitle,
      space: 1,
      children: [
        buildCustomField({
          id: 'PaymentChargeOverview',
          title: '',
          component: 'PaymentChargeOverview',
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
})
