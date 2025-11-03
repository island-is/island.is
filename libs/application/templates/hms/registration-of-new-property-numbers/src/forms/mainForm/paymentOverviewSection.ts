import {
  buildMultiField,
  buildPaymentChargeOverviewField,
  buildSection,
  buildSubmitField,
  coreMessages,
  getValueViaPath,
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
          getSelectedChargeItems: (application) => [
            {
              chargeItemCode:
                ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS.toString(),
              chargeItemQuantity: Number(
                getValueViaPath<string>(
                  application.answers,
                  'realEstate.realEstateAmount',
                ) || '0',
              ),
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
