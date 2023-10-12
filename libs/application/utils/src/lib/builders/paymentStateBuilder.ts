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
import { ExtraData } from '@island.is/clients/charge-fjs-v2'

type PaymentStateConfigOptions<
  T extends EventObject = AnyEventObject,
  R = unknown,
> = {
  organizationId: InstitutionNationalIds
  chargeItemCodes:
    | ((application: Application) => CatalogItem['chargeItemCode'][])
    | string[]
  extraData?:
    | ExtraData[]
    | ((application: Application) => ExtraData[] | undefined)
  abortTarget?: string
  lifecycle?: StateLifeCycle
  onExit?: TemplateApi<R>[]
  onEntry?: TemplateApi<R>[]
  roles?: RoleInState<T>[]
  submitCondition?: (context: ApplicationContext) => boolean
  submitTarget?:
    | {
        target: string
        cond?: (context: ApplicationContext) => boolean
      }[]
    | string
}

export function buildPaymentState<
  T extends EventObject = AnyEventObject,
  R = unknown,
>(
  options: PaymentStateConfigOptions<T, R>,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<T>, T> {
  const { onExit, onEntry } = options
  let submitTransitions: Array<{
    target: string
    cond?: (context: ApplicationContext) => boolean
  }> = []

  if (typeof options.submitTarget === 'string') {
    submitTransitions = [{ target: options.submitTarget }]
  } else if (options.submitTarget && Array.isArray(options.submitTarget)) {
    submitTransitions = options.submitTarget.map((targetObj) => {
      if (targetObj.cond) {
        return {
          target: targetObj.target,
          cond: targetObj.cond,
        }
      }
      return {
        target: targetObj.target,
      }
    })
  }
  submitTransitions =
    submitTransitions.length < 1 ? [{ target: 'done' }] : submitTransitions
  const transitions = {
    [DefaultEvents.SUBMIT]: [...submitTransitions], // Fallback to 'done' if no conditions are met
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
            extraData: options.extraData,
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
