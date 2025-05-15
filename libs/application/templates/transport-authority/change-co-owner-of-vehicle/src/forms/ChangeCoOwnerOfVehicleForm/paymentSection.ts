import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildPaymentChargeOverviewField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { payment } from '../../lib/messages'
import { getChargeItems, getChargeItemsWithAnswers } from '../../utils'
import { ChangeCoOwnerOfVehicle } from '../../lib/dataSchema'

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
          forPaymentLabel: payment.paymentChargeOverview.forPayment,
          totalLabel: payment.paymentChargeOverview.total,
          getSelectedChargeItems: (application) =>
            getChargeItems(application).map((item) => ({
              chargeItemCode: item.code,
              chargeItemQuantity: item.quantity,
            })),
        }),
        buildCustomField({
          id: 'ValidationErrorMessages',
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
                const chargeItems = getChargeItemsWithAnswers(
                  formValue as ChangeCoOwnerOfVehicle,
                )
                const allItems = externalData?.payment?.data as [
                  {
                    priceAmount: number
                    chargeItemName: string
                    chargeItemCode: string
                  },
                ]
                const items = chargeItems.map((chargeItem) => {
                  return allItems.find(
                    (item) => item.chargeItemCode === chargeItem.code,
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
