import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { payment } from '../../lib/messages'

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
        // buildCustomField({
        //   id: 'ValidationErrorMessages',
        //   title: '',
        //   component: 'ValidationErrorMessages',
        // }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: payment.confirmation.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: payment.confirmation.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
