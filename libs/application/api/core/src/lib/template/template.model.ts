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
  DataProviderBuilderItem,
  NationalRegistryUserApi,
  UserProfileApi,
  PaymentCatalogApi,
  InstitutionNationalIds,
  ValidateCriminalRecordApi,
  DataProviderItem,
  HistoryEventMessage,
  PendingAction,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  AnyEventObject,
  EventObject,
  StateNodeConfig,
  MachineConfig,
  MachineOptions,
  StatesConfig,
} from 'xstate'

import { z } from 'zod'

import { data, completedData } from './states'
import { buildDataProviderItem } from '@island.is/application/core'
import { buildTemplate } from '@island.is/application/utils'

export interface ApplicationBlueprint {
  ApplicatonType: ApplicationTypes
  initalState: string
  name: string
  states: StateBlueprint[]
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
  pendingAction?: PendingAction
  historyLogs?: HistoryEventMessage[] | HistoryEventMessage
  onEntry?: TemplateApi[] | TemplateApi
  onExit?: TemplateApi[] | TemplateApi
  dataProviders?: TemplateApi[]
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.REJECT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PREREQUISITES = 'prerequisites',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export function buildTemplates<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject = Events,
>(
  bluePrint: ApplicationBlueprint,
): ApplicationTemplate<TContext, TStateSchema, TEvents> {
  // 1. Extract data from blueprint
  const { initalState, name, states, ApplicatonType } = bluePrint

  // 2. Build states configuration
  const stateNodes: StatesConfig<TContext, TStateSchema, TEvents> =
    states.reduce((acc: any, state) => {
      acc[state.name] = buildState({}, state)
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
  stateBlueprint: StateBlueprint,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<T>, T> {
  const {
    transitions,
    onEntry,
    onExit,
    name,
    status,
    lifecycle,
    form,
    historyLogs,
    pendingAction,
    dataProviders,
  } = stateBlueprint

  return {
    meta: {
      name,
      status,
      lifecycle,
      actionCard: {
        historyLogs,
        pendingAction,
      },
      onExit,
      onEntry,
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
          form,
          api: dataProviders,
          write: 'all',
          delete: true,
        },
      ],
    },
    on: transformTransitions(transitions),
  }
}

type TransitionConfigOrTarget<TContext, TEvent extends EventObject> = {
  target: string
}

type TransitionsConfig<TContext, TEvents extends EventObject> = {
  [K in TEvents['type']]?: TransitionConfigOrTarget<
    TContext,
    TEvents extends { type: K } ? TEvents : never
  >
} & {
  [key: string]: TransitionConfigOrTarget<TContext, TEvents>
}
function transformTransitions<T extends EventObject>(
  transitions: Transition[],
): TransitionsConfig<unknown, T> {
  const result: { [key: string]: TransitionConfigOrTarget<unknown, T> } = {}

  for (const element of transitions) {
    result[element.event] = { target: element.target }
  }

  return result as TransitionsConfig<unknown, T>
}
