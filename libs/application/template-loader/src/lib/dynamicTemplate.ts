import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'

import { z } from 'zod'
import { createTemplate } from './templateBuilder'

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

/*
const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.NEW_TYPE_OF_APPLICATION,
  name: 'Umsókn umsókna',
  institution: 'Stafrænt ísland',
  translationNamespaces: [ApplicationConfigurations.CriminalRecord.translation],
  dataSchema: Schema,
  stateMachineConfig: {
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

              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
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
            tag: {
              label: 'Payment',
              variant: 'red',
            },
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
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
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
*/

const listOfTemplates = [
  {
    type: 'Númer 1',
    name: 'Umsókn 1',
  },
  {
    type: 'Númer 2',
    name: 'Umsókn 2',
  },
  {
    type: 'Númer 2',
    name: 'Umsókn 3',
  },
]

const template = createTemplate({
  type: ApplicationTypes.NEW_TYPE_OF_APPLICATION,
  name: 'Umsókn 2',
})

export default template
