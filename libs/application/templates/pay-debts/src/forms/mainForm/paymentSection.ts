import {
  buildMultiField,
  buildPaymentChargeOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { payment as messages } from '../../lib/messages'
import { getDebts } from '../../utils/getDebts'
import { getSelectedDebts } from '../../utils/getSelectedDebts'

export const paymentSection = buildSection({
  id: 'paymentSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentSection',
      title: messages.description.title,
      children: [
        buildPaymentChargeOverviewField({
          id: 'paymentChargeOverview',
          forPaymentLabel: messages.summary.forPaymentLabel,
          forPaymentLabelVariant: 'h5',
          totalLabel: messages.summary.totalLabel,
          simplifiedList: true,
          additionalSummaryLabel: messages.summary.remainingLabel,
          getAdditionalSummaryAmount: (application) => {
            const totalDebts = getDebts(application).reduce(
              (total, debt) => total + debt.debts,
              0,
            )
            const totalToPay = getSelectedDebts(application).reduce(
              (total, debt) => total + debt.amountToPay,
              0,
            )
            return totalDebts - totalToPay
          },
          getSelectedChargeItems: (application) =>
            getSelectedDebts(application).map((debt) => ({
              chargeItemCode: debt.chargeTypeId,
              chargeItemName: debt.chargeTypeName,
              chargeItemAmount: debt.amountToPay,
            })),
        }),
        buildSubmitField({
          id: 'submit',
          title: messages.buttons.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: messages.buttons.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
