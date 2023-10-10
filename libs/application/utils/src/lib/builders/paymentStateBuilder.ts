import {
  AnyEventObject,
  EventObject,
  StateNodeConfig,
  TransitionsConfig,
} from 'xstate'

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
  roles?: RoleInState<T>[]
}

export function buildPaymentState<
  T extends EventObject = AnyEventObject,
  R = unknown,
>(
  options: PaymentStateConfigOptions<T, R>,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<T>, T> {
  const { onExit, onEntry } = options

  const transitions = {
    [DefaultEvents.SUBMIT]: { target: options.submitTarget || 'done' },
    [DefaultEvents.ABORT]: { target: options.abortTarget || 'draft' },
  } as TransitionsConfig<ApplicationContext, T>

  return {
    meta: {
      name: 'Greiðsla',
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
            organizationId: options.organizationId,
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
            { event: 'SUBMIT', name: 'Panta', type: 'primary' },
            {
              event: 'ABORT',
              name: 'Hætta við',
              type: 'primary',
            },
          ],
          write: 'all',
          delete: true,
        },
      ],
    },
    on: transitions,
  }
}
/*
usage
import { buildPaymentState } from '@island.is/application/utils'

      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItemCodes: [ChargeItemCode.MORTGAGE_CERTIFICATE],
        submitTarget: States.COMPLETED,
        onExit: [
          defineTemplateApi({
            action: ApiActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
*/
