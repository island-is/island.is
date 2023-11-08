import {
  CreateChargeApi,
  DefaultEvents,
  DeletePaymentApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { paymentForm } from '../form/paymentFormBuilder'
import { state } from '../template/applicationBuilder'

export function paymentState(data: {
  institutionId: InstitutionNationalIds
  chargeItemCodes: string[]
  submitTarget: string
  abortTarget: string
}) {
  return state('payment', 'draft')
    .setForm(JSON.stringify(paymentForm()))
    .addOnExit(
      DeletePaymentApi.configure({
        triggerEvent: DefaultEvents.ABORT,
      }),
    )
    .addOnEntry(
      CreateChargeApi.configure({
        params: {
          organizationId: data.institutionId,
          chargeItemCodes: data.chargeItemCodes,
        },
      }),
    )
    .addTransition(DefaultEvents.SUBMIT, data.submitTarget)
    .addTransition(DefaultEvents.ABORT, data.abortTarget)
}
