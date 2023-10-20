import {
  AnswerValidator,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  AllowedDelegation,
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationStateMachineStatus,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  RoleInState,
  Schema,
  StateLifeCycle,
  StaticText,
  TemplateApi,
  ApplicationStateMeta,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  AnyEventObject,
  EventObject,
  StateNodeConfig,
  TransitionsConfig,
  MachineConfig,
  MachineOptions,
  StatesConfig,
} from 'xstate'

import { z } from 'zod'

type TemplateConfig<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
> = {
  readyForProduction?: boolean
  featureFlag?: Features
  type: ApplicationTypes
  name:
    | StaticText
    | ((
        application: Application,
      ) => StaticText | { name: StaticText; value: string })
  institution?: StaticText
  translationNamespaces?: string[]
  allowMultipleApplicationsInDraft?: boolean
  allowedDelegations?: AllowedDelegation[]
  requiredScopes?: string[]
  dataSchema?: Schema
  stateMachineConfig?: MachineConfig<TContext, TStateSchema, TEvents> & {
    states: StatesConfig<TContext, TStateSchema, TEvents>
  }
  stateMachineOptions?: Partial<MachineOptions<TContext, TEvents>>
  mapUserToRole?: (
    nationalId: string,
    application: Application,
  ) => ApplicationRole | undefined
  answerValidators?: Record<string, AnswerValidator>
}

export interface ApplicationBlueprint {
  ApplicatonType: ApplicationTypes
  initalState: string
  name: string
  states: StateBlueprint[]
  dataProviders: TemplateApi[] //TODO: maybe later map these to the state nodes but for now just limit to just the prerequisites state
}

export interface Transition {
  target: string
  event: string
}

export interface StateBlueprint {
  name: string
  form: string
  transitions: Transition[]
  status: ApplicationStateMachineStatus
  lifecycle: StateLifeCycle
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PREREQUISITES = 'prerequisites',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export function buildTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject = Events,
>(
  bluePrint: ApplicationBlueprint,
): ApplicationTemplate<TContext, TStateSchema, TEvents> {
  // 1. Extract data from blueprint
  const { initalState, name, states, ApplicatonType, dataProviders } = bluePrint

  // 2. Build states configuration
  const stateNodes: StatesConfig<TContext, TStateSchema, TEvents> =
    states.reduce((acc: any, state) => {
      acc[state.name] = {
        meta: {
          name: state.name,
          status: state.status,
          lifecycle: state.lifecycle,
          roles: [
            {
              id: Roles.APPLICANT,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'm.payUp',
                  type: 'primary',
                },
              ],
              form: state.form,
              write: 'all',
              read: 'all',
              api: dataProviders, //TODO: limit to just the prerequisites state
              delete: true,
            },
          ],
        },
        on: buildTransitions(state.transitions),
      }
      return acc as ApplicationStateMeta<TEvents>
    }, {} as StatesConfig<TContext, TStateSchema, TEvents>)

  const Schema = z.object({
    approveExternalData: z.boolean().refine((v) => v),
  })

  // 3. Create template configuration
  return {
    type: ApplicatonType, // Assuming the blueprint name is the application type
    name: name,
    institution: 'Stafrænt ísland',
    dataSchema: Schema,
    translationNamespaces: [
      '', //TODO get the namespace from the blueprint
    ],
    stateMachineConfig: {
      initial: initalState,
      states: stateNodes,
    },
    mapUserToRole(
      id: string,
      application: Application,
    ): ApplicationRole | undefined {
      if (id === application.applicant) {
        return Roles.APPLICANT
      }
      return undefined
    },
  }
}

function buildTransitions<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject = Events,
>(transitions: Transition[]): TransitionsConfig<TContext, Events> {
  return transitions.reduce((acc: any, transition) => {
    acc[transition.event] = transition.target
    return acc
  }, {} as TransitionsConfig<TContext, Events>)
}

/**
 * Configuration options for creating a payment state.
 *
 * @template T The event object type.
 * @template R The return type.
 */
type StateConfigOptions<T extends EventObject = AnyEventObject, R = unknown> = {
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
}

export function buildState<T extends EventObject = AnyEventObject, R = unknown>(
  options: StateConfigOptions<T, R>,
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
    [DefaultEvents.SUBMIT]: [...submitTransitions],
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
      ...(onExit || []),
      ...(onEntry || []),
      roles: options.roles || [
        {
          id: 'applicant',
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
