import { AnyEventObject, EventObject, StateNodeConfig } from 'xstate'

import { PaymentForm } from '@island.is/application/ui-forms'
import {
  Application,
  ApplicationContext,
  ApplicationStateSchema,
  CreateChargeApi,
  DefaultEvents,
  DeletePaymentApi,
  InstitutionNationalIds,
  RoleInState,
  StateLifeCycle,
  TemplateApi,
} from '@island.is/application/types'
import { CatalogItem } from '@island.is/clients/charge-fjs-v2'
import {
  pruneAfterDays,
  coreHistoryMessages,
  corePendingActionMessages,
} from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.ABORT }

type PaymentStateConfigOptions<
  T extends EventObject = AnyEventObject,
  R = unknown,
> = {
  organizationId: InstitutionNationalIds
  chargeItemCodes:
    | ((application: Application) => CatalogItem['chargeItemCode'][])
    | string[]
  submitTarget?: string
  abortTarget?: string
  lifecycle?: StateLifeCycle
  onExit?: TemplateApi<R>[]
  onEntry?: TemplateApi<R>[]
  roles?: RoleInState<Events>[]
}

export function buildPaymentState<
  T extends EventObject = AnyEventObject,
  R = unknown,
>(
  options: PaymentStateConfigOptions<T, R>,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<Events>, Events> {
  const { onExit, onEntry } = options

  return {
    meta: {
      name: 'Payment state',
      status: 'inprogress',
      lifecycle: options.lifecycle || pruneAfterDays(1),
      actionCard: {
        historyLogs: [
          {
            logMessage: coreHistoryMessages.paymentAccepted,
            onEvent: DefaultEvents.SUBMIT,
          },
          {
            logMessage: coreHistoryMessages.paymentCancelled,
            onEvent: DefaultEvents.ABORT,
          },
        ],
        pendingAction: {
          title: corePendingActionMessages.paymentPendingTitle,
          content: corePendingActionMessages.paymentPendingDescription,
          displayStatus: 'warning',
        },
      },
      onExit: [
        DeletePaymentApi.configure({
          triggerEvent: DefaultEvents.ABORT,
        }),
        ...(onExit || []),
      ],
      onEntry: [
        CreateChargeApi.configure({
          params: {
            organizationId: InstitutionNationalIds.SYSLUMENN,
            chargeItemCodes: options.chargeItemCodes,
          },
        }),
        ...(onEntry || []),
      ],
      roles: options.roles || [
        {
          id: 'applicant',
          formLoader: async () => {
            return PaymentForm
          },
          actions: [
            { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
            {
              event: DefaultEvents.ABORT,
              name: 'Hætta við',
              type: 'primary',
            },
          ],
          write: 'all',
          delete: true,
        },
      ],
    },
    on: {
      [DefaultEvents.SUBMIT]: { target: options.submitTarget || 'done' },
      [DefaultEvents.ABORT]: { target: options.abortTarget || 'draft' },
    },
  }
}
