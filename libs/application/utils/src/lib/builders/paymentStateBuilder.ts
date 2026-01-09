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
  BasicChargeItem,
  CreateChargeApi,
  DefaultEvents,
  DeletePaymentApi,
  InstitutionNationalIds,
  RoleInState,
  StateLifeCycle,
  TemplateApi,
} from '@island.is/application/types'
import {
  pruneAfterDays,
  coreHistoryMessages,
  corePendingActionMessages,
} from '@island.is/application/core'
import { ExtraData } from '@island.is/clients/charge-fjs-v2'

/**
 * Configuration options for creating a payment state.
 *
 * @template T The event object type.
 * @template R The return type.
 */
type PaymentStateConfigOptions<
  T extends EventObject = AnyEventObject,
  R = unknown,
> = {
  /** The ID of the organization handling the payment. */
  organizationId: InstitutionNationalIds

  /**
   * The codes for the charge items. This can either be an array of strings
   * or a function that returns an array based on the application data.
   */
  chargeItems:
    | BasicChargeItem[]
    | ((application: Application) => BasicChargeItem[])

  /**
   * Any additional data that needs to be passed for the payment to the create charge function.
   * This can be an array or a function returning an array.
   */
  extraData?:
    | ExtraData[]
    | ((application: Application) => ExtraData[] | undefined)

  /** The target state if the payment process is aborted. Defaults to 'draft'. */
  abortTarget?: string

  /** The lifecycle duration of the payment state. */
  lifecycle?: StateLifeCycle

  /** Functions to call when exiting the payment state. */
  onExit?: TemplateApi<R>[]

  /** Functions to call when entering the payment state. */
  onEntry?: TemplateApi<R>[]

  /** Roles associated with the payment state.  Defaults to a single role Roles.APPLICANT */
  roles?: RoleInState<T>[]

  /**
   * The target state after the payment is submitted.
   * This can be a string representing the target state, or an array
   * of target objects with optional conditions. Defaults to 'done'.
   */
  submitTarget?:
    | {
        target: string
        cond?: (context: ApplicationContext) => boolean
      }[]
    | string

  /**
   * Optional payer national ID. If not provided, the logged-in user's national ID is used.
   * This can be a string or a function that returns a string based on the application data.
   */
  payerNationalId?: string | ((application: Application) => string)
}

/**
 * Constructs a payment state based on the provided configuration options.
 *
 * @template T The event object type.
 * @template R The return type.
 * @param options The configuration options for the payment state.
 * @returns The constructed payment state.
 */
export const buildPaymentState = <
  T extends EventObject = AnyEventObject,
  R = unknown,
>(
  options: PaymentStateConfigOptions<T, R>,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<T>, T> => {
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
    [DefaultEvents.SUBMIT]: [...submitTransitions],
    [DefaultEvents.ABORT]: { target: options.abortTarget || 'draft' },
  } as TransitionsConfig<ApplicationContext, T>

  return {
    meta: {
      name: 'Greiðsla',
      status: 'inprogress',
      lifecycle: {
        ...pruneAfterDays(1),
        shouldDeleteChargeIfPaymentFulfilled: true,
        ...options.lifecycle,
      },
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
            chargeItems: options.chargeItems,
            extraData: options.extraData,
            payerNationalId: options.payerNationalId,
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
