import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  UserProfileApi,
  DefaultEvents,
  FormModes,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { exampleSchema } from './dataSchema'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  EphemeralApi,
  MyMockProvider,
  NationalRegistryApi,
  ReferenceDataApi,
  SendNotification,
} from '../dataProviders'
import { assign } from 'xstate'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  name: 'Example Common Actions',
  codeOwner: CodeOwners.NordaApplications,
  institution: 'Stafrænt Ísland',
  dataSchema: exampleSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          actionCard: {
            title: 'Test titill prerequsites',
            description: 'Test description prerequsites',
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: 'Eitthvað message prerequsites',
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [
                ReferenceDataApi.configure({
                  params: {
                    id: 1986,
                  },
                }),
                NationalRegistryApi.configure({
                  params: {
                    ageToValidate: 18,
                  },
                }),
                UserProfileApi,
                MyMockProvider,
                EphemeralApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          onEntry: [SendNotification],
          actionCard: {
            title: 'Test titill draft',
            description: 'Test description draft',
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: 'Eitthvað message draft',
              },
            ],
            tag: {
              label: 'Main form',
              variant: 'blue',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/exampleCommonActionsForm').then((module) =>
                  Promise.resolve(module.ExampleCommonActionsForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [SendNotification],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          actionCard: {
            title: 'Test titill completed.',
            description: 'Test title completed',
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: 'Eitthvað message completed',
              },
            ],
          },
          lifecycle: DefaultStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              write: 'all',
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
