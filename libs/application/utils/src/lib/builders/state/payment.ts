import {
  CreateChargeApi,
  DefaultEvents,
  DeletePaymentApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { paymentForm } from '../form/paymentFormBuilder'
import { state } from '../template/applicationBuilder'
import {
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'

export function paymentState(data: {
  institutionId: InstitutionNationalIds
  chargeItemCodes: string[]
  submitTarget: string
  abortTarget: string
}) {
  const form = paymentForm()

  return state('payment', 'draft')
    .setForm(form)
    .addOnExit(
      DeletePaymentApi.configure({
        triggerEvent: DefaultEvents.ABORT,
      }),
    )
    .lifecycle(pruneAfterDays(1))
    .addPendingAction({
      title: corePendingActionMessages.paymentPendingTitle,
      content: corePendingActionMessages.paymentPendingDescription,
      displayStatus: 'warning',
    })
    .addHistoryLog({
      logMessage: coreHistoryMessages.paymentAccepted,
      onEvent: DefaultEvents.SUBMIT,
    })
    .addHistoryLog({
      logMessage: coreHistoryMessages.paymentCancelled,
      onEvent: DefaultEvents.ABORT,
    })
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
