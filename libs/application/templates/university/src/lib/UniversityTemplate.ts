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
import { application as applicationMessage } from './messages'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { UniversitySchema } from './dataSchema'
import {
  UserProfileApi,
  NationalRegistryUserApi,
  UniversityApi,
  ProgramApi,
  InnaApi,
} from '../dataProviders'
import { assign } from 'xstate'
import set from 'lodash/set'

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
  stateMachineOptions: {
    actions: {
      assignToWorker: assign((context) => {
        const { application } = context
        const thirdPartyAssignee = '7101220830'
        set(application, 'assignees', [thirdPartyAssignee])

        return context
      }),
      clearAssignees: assign((context) => {
        const { application } = context
        set(application, 'assignees', [])
        return context
      }),
    },
  },
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
        entry: 'assignToWorker',
        exit: ['clearAssignees'], //ideally you would clear the assignees here
        meta: {
          name: States.PENDING_SCHOOL,
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardInSchoolReview,
              variant: 'purple',
            },
            pendingAction: {
              title: applicationMessage.pendingActionSchool,
              content: applicationMessage.pendingActionContentSchool,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                logMessage: applicationMessage.actionCardSchoolAcceptedHistory,
                onEvent: DefaultEvents.APPROVE,
              },
            ],
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
            {
              id: Roles.UNIVERSITY_GATEWAY,
              read: 'all',
              write: 'all',
            },
          ],
          lifecycle: pruneAfterDays(3 * 30),
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.PENDING_STUDENT },
          [DefaultEvents.REJECT]: { target: States.SCHOOL_REJECTED },
        },
      },
      [States.PENDING_STUDENT]: {
        meta: {
          name: 'Svar frá umsækjanda',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            pendingAction: {
              title: applicationMessage.pendingActionSchoolAcceptedHistory,
              content:
                applicationMessage.pendingActionPendingStudentAnswerContent,
              displayStatus: 'error',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationAssigned,
                onEvent: DefaultEvents.APPROVE,
              },
              {
                logMessage: coreHistoryMessages.applicationAssigned,
                onEvent: DefaultEvents.REJECT,
              },
            ],
          },
          lifecycle: pruneAfterDays(30 * 3), // TODO Random placeholder
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Overview').then((module) =>
                  Promise.resolve(module.OverviewForm),
                ),
              write: 'all',
              read: 'all',
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.COMPLETED },
          [DefaultEvents.REJECT]: { target: States.STUDENT_REJECTED },
        },
      },
      [States.SCHOOL_REJECTED]: {
        meta: {
          name: States.PENDING_SCHOOL,
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardSchoolRejected,
              variant: 'red',
            },
            pendingAction: {
              title: applicationMessage.pendingActionSchoolTitleRejected,
              content: applicationMessage.pendingActionSchoolRejected,
              displayStatus: 'error',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
            },
          ],
          lifecycle: pruneAfterDays(3 * 30),
        },
      },
      [States.STUDENT_REJECTED]: {
        meta: {
          name: States.PENDING_SCHOOL,
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardStudentRejected,
              variant: 'red',
            },
            pendingAction: {
              title: applicationMessage.pendingActionSchool,
              content: applicationMessage.pendingActionSchoolRejected,
              displayStatus: 'error',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
            },
          ],
          lifecycle: pruneAfterDays(3 * 30),
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
    } else if (id === '7101220830') {
      return Roles.UNIVERSITY_GATEWAY
    }
  },
}

export default template
