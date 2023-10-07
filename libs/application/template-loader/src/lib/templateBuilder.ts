import { AnswerValidator } from '@island.is/application/core'
import {
  AllowedDelegation,
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  Schema,
  StaticText,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  EventObject,
  MachineConfig,
  MachineOptions,
  StatesConfig,
} from 'xstate'

import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'

import { z } from 'zod'

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

type TemplateConfig<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
> = {
  readyForProduction?: boolean
  featureFlag?: Features
  type: ApplicationTypes | string
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

export function createTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
>(
  config: TemplateConfig<
    ApplicationContext,
    ApplicationStateSchema<Events>,
    Events
  >,
): ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> {
  const Schema = z.object({
    approveExternalData: z.boolean().refine((v) => v),
  })

  return {
    institution: 'Stafrænt ísland',
    translationNamespaces: [
      ApplicationConfigurations.CriminalRecord.translation,
    ],
    dataSchema: Schema,
    stateMachineConfig: paymentMachineConfig,
    mapUserToRole(
      id: string,
      application: Application,
    ): ApplicationRole | undefined {
      if (id === application.applicant) {
        return Roles.APPLICANT
      }
      return undefined
    },
    ...config,
  }
}

const basicMachineConfig: MachineConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> & {
  states: StatesConfig<
    ApplicationContext,
    ApplicationStateSchema<Events>,
    Events
  >
} = {
  initial: States.PREREQUISITES,
  states: {
    [States.PREREQUISITES]: {
      meta: {
        name: 'Skilyrði',
        progress: 0,
        status: 'draft',
        lifecycle: {
          shouldBeListed: false,
          shouldBePruned: true,
          // Applications that stay in this state for 24 hours will be pruned automatically
          whenToPrune: 24 * 3600 * 1000,
        },
        roles: [
          {
            id: Roles.APPLICANT,

            actions: [{ event: 'SUBMIT', name: 'Staðfesta', type: 'primary' }],
            write: 'all',
            read: 'all',
            api: [NationalRegistryUserApi, UserProfileApi],
            delete: true,
          },
        ],
      },
      on: {
        SUBMIT: {
          target: States.DRAFT,
        },
      },
    },
    [States.DRAFT]: {
      meta: {
        name: 'Umsókn um sem er ný',
        status: 'draft',
        actionCard: {
          historyLogs: [
            {
              logMessage: coreHistoryMessages.paymentStarted,
              onEvent: DefaultEvents.SUBMIT,
            },
          ],
        },
        lifecycle: EphemeralStateLifeCycle,
        roles: [
          {
            id: Roles.APPLICANT,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: 'Staðfesta',
                type: 'primary',
              },
            ],
            write: 'all',
            api: [],
          },
        ],
      },
      on: {
        [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
      },
    },
    [States.COMPLETED]: {
      meta: {
        name: 'Completed',
        status: 'completed',
        lifecycle: pruneAfterDays(3 * 30),
        actionCard: {
          pendingAction: {
            title: 'Pending action',
            displayStatus: 'success',
          },
        },
        roles: [
          {
            id: Roles.APPLICANT,
            read: 'all',
          },
        ],
      },
    },
  },
}

const paymentMachineConfig: MachineConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> & {
  states: StatesConfig<
    ApplicationContext,
    ApplicationStateSchema<Events>,
    Events
  >
} = {
  initial: States.PREREQUISITES,
  states: {
    [States.PREREQUISITES]: {
      meta: {
        name: 'Skilyrði',
        progress: 0,
        status: 'draft',
        lifecycle: {
          shouldBeListed: false,
          shouldBePruned: true,
          // Applications that stay in this state for 24 hours will be pruned automatically
          whenToPrune: 24 * 3600 * 1000,
        },
        roles: [
          {
            id: Roles.APPLICANT,

            actions: [{ event: 'SUBMIT', name: 'Staðfesta', type: 'primary' }],
            write: 'all',
            read: 'all',
            api: [NationalRegistryUserApi, UserProfileApi],
            delete: true,
          },
        ],
      },
      on: {
        SUBMIT: {
          target: States.DRAFT,
        },
      },
    },
    [States.DRAFT]: {
      meta: {
        name: 'Umsókn um sem er ný',
        status: 'draft',
        actionCard: {
          historyLogs: [
            {
              logMessage: coreHistoryMessages.paymentStarted,
              onEvent: DefaultEvents.SUBMIT,
            },
          ],
        },
        lifecycle: EphemeralStateLifeCycle,
        roles: [
          {
            id: Roles.APPLICANT,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: 'Staðfesta',
                type: 'primary',
              },
            ],
            write: 'all',
            api: [],
          },
        ],
      },
      on: {
        [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
      },
    },
    [States.PAYMENT]: {
      meta: {
        name: 'Greiðsla',
        status: 'inprogress',
        actionCard: {
          pendingAction: {
            title: corePendingActionMessages.paymentPendingTitle,
            content: corePendingActionMessages.paymentPendingDescription,
            displayStatus: 'warning',
          },
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
        },
        lifecycle: pruneAfterDays(1 / 24),

        roles: [
          {
            id: Roles.APPLICANT,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: 'Áfram',
                type: 'primary',
              },
            ],
            write: 'all',
            delete: true,
          },
        ],
      },
      on: {
        [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        [DefaultEvents.ABORT]: { target: States.DRAFT },
      },
    },
    [States.COMPLETED]: {
      meta: {
        name: 'Completed',
        status: 'completed',
        lifecycle: pruneAfterDays(3 * 30),
        actionCard: {
          pendingAction: {
            title: 'Pending action',
            displayStatus: 'success',
          },
        },
        roles: [
          {
            id: Roles.APPLICANT,

            read: 'all',
          },
        ],
      },
    },
  },
}
