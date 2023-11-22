import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildPaymentChargeOverviewField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'
import { getChargeItemCodeWithAnswers } from '../../utils/getChargeItemCodes'
import { ChangeOperatorOfVehicle } from '../../lib/dataSchema'

export const paymentSection = buildSection({
  id: 'payment',
  title: payment.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentMultiField',
      title: payment.general.pageTitle,
      space: 1,
      children: [
        buildPaymentChargeOverviewField({
          id: 'uiForms.paymentChargeOverviewMultifield',
          title: '',
          forPaymentLabel: payment.paymentChargeOverview.forPayment,
          totalLabel: payment.paymentChargeOverview.total,
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
          title: payment.general.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: payment.general.confirm,
              type: 'primary',
              condition: (formValue, externalData) => {
                const chargeItemCodes = getChargeItemCodeWithAnswers(
                  formValue as ChangeOperatorOfVehicle,
                )
                const allItems = externalData?.payment?.data as [
                  {
                    priceAmount: number
                    chargeItemName: string
                    chargeItemCode: string
                  },
                ]
                const items = chargeItemCodes.map((chargeItemCode) => {
                  return allItems.find(
                    (item) => item.chargeItemCode === chargeItemCode,
                  )
                })
                return items.length > 0
              },
            },
          ],
        }),
      ],
    }),
  ],
})
