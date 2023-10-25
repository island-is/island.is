import {
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { payment } from '../../lib/messages'
import { getChargeItemCodesWithAnswers } from '../../utils'
import { OrderVehicleLicensePlate } from '../../lib/dataSchema'

export const paymentSection = buildSection({
  id: 'payment',
  title: payment.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentMultiField',
      title: payment.general.pageTitle,
      space: 1,
      children: [
        buildCustomField({
          id: 'PaymentChargeOverview',
          title: '',
          component: 'PaymentChargeOverview',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: payment.confirmation.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: payment.confirmation.confirm,
              type: 'primary',
              condition: (formValue, externalData) => {
                const chargeItemCodes = getChargeItemCodesWithAnswers(
                  formValue as OrderVehicleLicensePlate,
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
