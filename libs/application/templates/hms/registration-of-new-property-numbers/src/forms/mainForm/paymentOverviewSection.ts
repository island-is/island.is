import {
  buildMultiField,
  buildPaymentChargeOverviewField,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { paymentOverview } from '../../lib/messages'
import { ChargeItemCode } from '@island.is/shared/constants'

export const paymentOverviewSection = buildSection({
  id: 'paymentOverviewSection',
  title: paymentOverview.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentOverviewSection',
      title: paymentOverview.title,
      children: [
        buildPaymentChargeOverviewField({
          id: 'uiForms.paymentChargeOverviewMultifield',
          forPaymentLabel: paymentOverview.toPay,
          totalLabel: paymentOverview.total,
          getSelectedChargeItems: (_) => [
            {
              chargeItemCode:
                ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS.toString(),
              chargeItemQuantity: 5,
              extraLabel: 'fasteignarnúmer',
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: coreMessages.buttonNext,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
