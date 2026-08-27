import {
  buildDescriptionField,
  buildMultiField,
  buildPaymentChargeOverviewField,
  buildSection,
} from '@island.is/application/core'
import { payment as messages } from '../../lib/messages'
import { getSelectedDebts } from '../../utils/getSelectedDebts'

export const paymentSection = buildSection({
  id: 'paymentSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentSection',
      title: messages.description.title,
      children: [
        buildDescriptionField({
          id: 'description',
          space: 'none',
        }),
        buildPaymentChargeOverviewField({
          id: 'paymentChargeOverview',
          forPaymentLabel: messages.summary.forPaymentLabel,
          totalLabel: messages.summary.totalLabel,
          simplifiedList: true,
          getSelectedChargeItems: (application) =>
            getSelectedDebts(application).map((debt) => ({
              chargeItemCode: debt.chargeTypeId,
              chargeItemName: debt.chargeTypeName,
              chargeItemAmount: debt.amountToPay,
            })),
        }),
      ],
    }),
  ],
})
