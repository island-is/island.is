import {
  buildMultiField,
  buildPaymentChargeOverviewField,
  buildSection,
  buildSubmitField,
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
        buildPaymentChargeOverviewField({
          id: 'paymentChargeOverview',
          forPaymentLabel: messages.summary.forPaymentLabel,
          forPaymentLabelVariant: 'h5',
          totalLabel: messages.summary.totalLabel,
          simplifiedList: true,
          getSelectedChargeItems: (application) =>
            // chargeTypeId is a charge *category*, not a unique per-debt id,
            // so two selected debts can share it - suffix with index to keep
            // this list's React keys unique. Display-only, unrelated to the
            // chargeItems used for the actual FJS charge in template.ts.
            getSelectedDebts(application).map((debt, index) => {
              const remaining = debt.debts - debt.amountToPay

              return {
                chargeItemCode: `${debt.chargeTypeId}-${index}`,
                chargeItemName: debt.chargeTypeName,
                chargeItemAmount: debt.amountToPay,
                ...(remaining > 0
                  ? {
                      subLabel: messages.summary.remainingLabel,
                      subAmount: remaining,
                    }
                  : {}),
              }
            }),
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
