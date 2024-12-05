import {
  coreHistoryMessages,
  corePendingActionMessages,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultEvents,
  UserProfileApi,
  ApplicationConfigurations,
  Application,
  defineTemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { Roles, States, Events } from './constants'
import { PracticalExamAnswersSchema } from './dataSchema'
import { IdentityApi } from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { shared } from './messages/shared'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PRACTICAL_EXAM,
  name: shared.application.name,
  institution: shared.application.institutionName,
  translationNamespaces: ApplicationConfigurations.PracticalExam.translation,
  dataSchema: PracticalExamAnswersSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.vinnueftirlitid],
  //featureFlag: Features.WorkAccidentNotificationEnabled,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          actionCard: {
            tag: {
              label: shared.application.actionCardPrerequisites,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [IdentityApi, UserProfileApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Skráning í verklegt próf',
          status: 'draft',
          actionCard: {
            tag: {
              label: shared.application.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PracticalExamForm/index').then((module) =>
                  Promise.resolve(module.PracticalExamForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
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
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: 'TODO REPLACE ME',
          }),
          actionCard: {
            tag: {
              //label: shared.application.actionCardDone,
              variant: 'blueberry',
            },
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              // formLoader: () =>
              //   import('../forms/Conclusion').then((module) =>
              //     Promise.resolve(module.Conclusion),
              //   ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {},
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

export default template
