import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application, application as applicationMessage } from './messages'
import { Features } from '@island.is/feature-flags'
import { ApiActions, CustomActions } from '../shared'
import { UniversitySchema } from './dataSchema'
import {
  UserProfileApi,
  NationalRegistryUserApi,
  UniversityApi,
  ProgramApi,
  InnaApi,
} from '../dataProviders'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.UNIVERSITY,
  name: applicationMessage.name,
  institution: applicationMessage.institutionName,
  translationNamespaces: [ApplicationConfigurations.University.translation],
  initialQueryParameter: 'program',
  dataSchema: UniversitySchema,
  featureFlag: Features.university,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Gagnaöflun',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          progress: 0.1,
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
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                UniversityApi,
                ProgramApi,
                InnaApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um inngöngu í háskóla',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationAssigned,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: 'PRUFA',
                onEvent: DefaultEvents.TEST,
              },
            ],
          },
          progress: 0.25,
          lifecycle: pruneAfterDays(1),
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/UniversityForm').then((module) =>
                  Promise.resolve(module.UniversityForm),
                ),
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PENDING_SCHOOL },
        },
      },
      [States.PENDING_SCHOOL]: {
        meta: {
          name: 'Umsókn um inngöngu í háskóla',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardWaitingForSchool,
              variant: 'purple',
            },
            // historyLogs: [
            //   {
            //     onEvent: DefaultEvents.SUBMIT,
            //     logMessage: coreHistoryMessages.applicationApproved,
            //   },
            // ], TODO
            pendingAction: {
              title: coreHistoryMessages.applicationInProgress,
              content: application.pendingActionSchool,
              displayStatus: 'info',
            },
          },
          lifecycle: pruneAfterDays(90), // TODO what should this be?
          onExit: defineTemplateApi({
            action: ApiActions.addSchoolAcceptance, // TODO what if the school does not accept
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Overview').then((module) =>
                  Promise.resolve(module.OverviewForm),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.PENDING_STUDENT]: {
        meta: {
          name: 'Umsókn um inngöngu í háskóla',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.historyApprovedBySchool,
              variant: 'mint',
            },
            // historyLogs: [
            //   {
            //     onEvent: DefaultEvents.SUBMIT,
            //     logMessage: coreHistoryMessages.applicationApproved,
            //   },
            // ], TODO
            pendingAction: {
              title: coreHistoryMessages.applicationApproved,
              content: application.pendingActionStudent,
              displayStatus: 'warning',
            },
          },
          lifecycle: pruneAfterDays(90), // TODO what should this be?
          onExit: defineTemplateApi({
            action: ApiActions.addStudentAcceptance, // TODO what if the school does not accept
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Overview').then((module) =>
                  Promise.resolve(module.OverviewForm),
                ),
              read: 'all',
              // write: { answers: [ // TODO is this correct and add this to dataScheme
              //     'approvedByStudent',
              //   ],
              // }
            },
          ],
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDone,
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
              formLoader: () =>
                import('../forms/Confirmation').then((val) =>
                  Promise.resolve(val.Confirmation),
                ),
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

export default template
