import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const sectionPayment = buildSection({
  id: 'payment',
  title: m.paymentSection,
  children: [
    buildMultiField({
      id: 'payment',
      title: m.paymentSectionTitle,
      children: [
        buildCustomField({
          id: 'paymentCharge',
          component: 'PaymentCharge',
        }),
        buildSubmitField({
          id: 'payment',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.proceedToPayment,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
