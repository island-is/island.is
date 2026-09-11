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
            // payID is FJS' per-debt identifier - the one that goes with the
            // payment - so it is what identifies a line here as well.
            getSelectedDebts(application).map((debt) => {
              const remaining = debt.debts - debt.amountToPay

              return {
                chargeItemCode: debt.payID,
                chargeItemName: `${debt.chargeTypeName} - ${debt.chargeItemSubject}`,
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
