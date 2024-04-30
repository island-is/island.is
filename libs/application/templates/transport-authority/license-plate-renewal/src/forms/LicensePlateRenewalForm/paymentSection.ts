import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildPaymentChargeOverviewField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
// import { payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'

export const paymentSection = buildSection({
  id: 'payment',
  title: 'test44444',
  condition: () => {
    console.log('OMG')
    return false
  },
  children: [
    buildMultiField({
      id: 'paymentMultiField',
      title: 'test11111',
      condition: () => {
        console.log('here')
        return false
      },
      space: 1,
      children: [
        buildPaymentChargeOverviewField({
          id: 'uiForms.paymentChargeOverviewMultifield',
          title: '',
          forPaymentLabel: 'test22222',
          totalLabel: 'test3333',
          getSelectedChargeItems: (application) =>
            getChargeItemCodes(application).map((x) => ({
              chargeItemCode: x,
            })),
        }),
        buildCustomField({
          id: 'ValidationErrorMessages',
          title: '',
          component: 'ValidationErrorMessages',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'test',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'test',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
