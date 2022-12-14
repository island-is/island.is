import { User } from '@island.is/auth-nest-tools'
import { Charge } from '@island.is/clients/charge-fjs-v2'
import { Payment } from '../payment.model'

export function formatCharge(
  payment: Payment,
  callbackBaseUrl: string,
  callbackAdditionUrl: string,
  user: User,
): Charge {
  // TODO: island.is x-road service path for callback.. ??
  // this can actually be a fixed url
  const callbackUrl =
    ((callbackBaseUrl + payment.application_id) as string) +
    callbackAdditionUrl +
    payment.id

  const parsedDefinition = JSON.parse((payment.definition as unknown) as string)

  const parsedDefinitionCharges = parsedDefinition.charges as [
    {
      chargeItemName: string
      chargeItemCode: string
      amount: number
    },
  ]
  return {
    // TODO: this needs to be unique, but can only handle 22 or 23 chars
    // should probably be an id or token from the DB charge once implemented
    chargeItemSubject: payment.id.substring(0, 22),
    systemID: 'ISL',
    // The OR values can be removed later when the system will be more robust.
    performingOrgID: parsedDefinition.performingOrganizationID,
    payeeNationalID: user.nationalId,
    chargeType: parsedDefinition.chargeType,
    performerNationalID: user.nationalId,
    charges: parsedDefinitionCharges.map((parsedDefinitionCharge) => ({
      chargeItemCode: parsedDefinitionCharge.chargeItemCode,
      quantity: 1,
      priceAmount: parsedDefinitionCharge.amount,
      amount: parsedDefinitionCharge.amount,
      reference: '',
    })),
    immediateProcess: true,
    returnUrl: callbackUrl,
    requestID: payment.id,
  }
}
