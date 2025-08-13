import { getValueViaPath } from '@island.is/application/core'
import { FormValue, KeyValueItem } from '@island.is/application/types'
import { PaymentArrangementType } from '../lib/dataSchema'
import { IndividualOrCompany, PaymentOptions, SelfOrOthers } from './enums'
import { overview } from '../lib/messages'

export const getPaymentArrangementForOverview = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const paymentArrangementAnswer = getValueViaPath<PaymentArrangementType>(
    answers,
    'paymentArrangement',
  )
  const isRegisteringSelf = getValueViaPath<SelfOrOthers>(
    answers,
    'information.selfOrOthers',
  )

  const explanation = paymentArrangementAnswer?.explanation
  const individualOrCompany = paymentArrangementAnswer?.individualOrCompany
  const paymentOptions = paymentArrangementAnswer?.paymentOptions

  if (
    isRegisteringSelf === SelfOrOthers.self ||
    individualOrCompany === IndividualOrCompany.individual ||
    paymentOptions === PaymentOptions.cashOnDelivery
  ) {
    return [
      {
        width: 'full',
        keyText: overview.payment.title,
        valueText: overview.payment.cashOnDelivery,
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: overview.payment.title,
      valueText: [
        {
          ...overview.payment.invoice,
        },
        {
          ...overview.payment.explanation,
          values: {
            value: explanation,
          },
        },
      ],
    },
  ]
}
