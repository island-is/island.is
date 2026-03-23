import {
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildPaymentChargeOverviewField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { EstateTypes } from '../../lib/constants'
import { getChargeItems } from '../../utils/getChargeItems'

const isPaymentEnabled = (externalData: Record<string, unknown>): boolean => {
  const paymentData = getValueViaPath(externalData, 'payment.data')
  return Array.isArray(paymentData) && paymentData.length > 0
}

export const payment = buildSection({
  id: 'paymentSection',
  title: m.paymentTitle,
  condition: (answers, externalData) => {
    const selectedEstate = getValueViaPath(answers, 'selectedEstate')
    const supportsPayment =
      selectedEstate === EstateTypes.divisionOfEstateByHeirs ||
      selectedEstate === EstateTypes.permitForUndividedEstate
    return supportsPayment && isPaymentEnabled(externalData)
  },
  children: [
    buildMultiField({
      id: 'paymentMultiField',
      title: m.paymentTitle,
      children: [
        buildPaymentChargeOverviewField({
          id: 'paymentChargeOverviewSection',
          forPaymentLabel: m.forPayment,
          totalLabel: m.total,
          getSelectedChargeItems: (application) =>
            getChargeItems(application).map((item) => ({
              chargeItemCode: item.code,
            })),
        }),
        buildSubmitField({
          id: 'paymentSubmit',
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
