import { Charge } from '@island.is/clients/charge-fjs-v2'
import { PaymentFlowAttributes } from '../app/paymentFlow/models/paymentFlow.model'
import { CatalogItemWithQuantity } from '../types/charges'
import { FjsErrorCode } from '@island.is/shared/constants'

type PayInfo = Charge['payInfo']

export const generateChargeFJSPayload = ({
  id,
  paymentFlow,
  charges,
  systemId,
  payInfo,
  returnUrl = '',
}: {
  id: string
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItemWithQuantity[]
  totalPrice: number
  systemId: string
  payInfo?: PayInfo // If this is skipped, then the charge will create an invoice
  returnUrl?: string
}): Charge => {
  return {
    // Unique id for the charge, no longer than 22 characters
    chargeItemSubject: id.substring(0, 22),
    chargeType: charges[0].chargeType,
    charges: charges.map((charge) => ({
      amount: charge.priceAmount,
      chargeItemCode: charge.chargeItemCode,
      priceAmount: charge.priceAmount,
      quantity: charge.quantity,
      // Reference id, empty for now
      reference: '',
    })),
    immediateProcess: true,
    payeeNationalID: paymentFlow.payerNationalId,
    performerNationalID: paymentFlow.payerNationalId,
    performingOrgID: paymentFlow.organisationId,
    requestID: paymentFlow.id,
    systemID: systemId,
    payInfo,
    returnUrl,
  }
}

export const fjsErrorMessageToCode = (message: string): FjsErrorCode => {
  if (message.startsWith('Búið að taka á móti álagningu')) {
    return FjsErrorCode.AlreadyCreatedCharge
  }

  return FjsErrorCode.FailedToCreateCharge
}
