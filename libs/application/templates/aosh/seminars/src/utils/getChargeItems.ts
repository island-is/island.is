import { getValueViaPath } from '@island.is/application/core'
import { Application, BasicChargeItem } from '@island.is/application/types'
import { PaymentOptions } from '../shared/contstants'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const typeOfPayment = getValueViaPath<PaymentOptions>(
    application.answers,
    'paymentArrangement.paymentOptions',
  )
  const codeFromVer = getValueViaPath<string>(
    application.externalData,
    typeOfPayment === PaymentOptions.cashOnDelivery
      ? 'seminar.data.feeCodeDirectPayment'
      : 'seminar.data.feeCodeInvoice',
  )
  return [{ code: codeFromVer || '' }]
}
