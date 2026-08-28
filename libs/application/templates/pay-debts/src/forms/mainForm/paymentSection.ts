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
            // chargeTypeId is a charge *category*, not a unique per-debt id,
            // so two selected debts can share it - suffix with index to keep
            // this list's React keys unique. Display-only, unrelated to the
            // chargeItems used for the actual FJS charge in template.ts.
            getSelectedDebts(application).map((debt, index) => ({
              chargeItemCode: `${debt.chargeTypeId}-${index}`,
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
