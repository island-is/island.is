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
import set from 'lodash/set'
import { assign } from 'xstate'
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
      assignToInstitution: assign((context) => {
        const { application } = context
        const institution_ID = 'xxxxxx-xxxx'

        set(application, 'assignees', [institution_ID])

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
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.PENDING_SCHOOL]: {
        entry: 'assignToInstitution',
        exit: 'clearAssignees',
        meta: {
          name: States.PENDING_SCHOOL,
          status: 'inprogress',
          progress: 0.5,
          lifecycle: pruneAfterDays(30),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationAssigned, // TODO change this to the correct message
                onEvent: DefaultEvents.APPROVE,
              },
            ],
          },
          roles: [
            {
              id: Roles.UNIVERSITY_GATEWAY,
              formLoader: () =>
                import('../forms/Confirmation').then(
                  (
                    val, // TODO what should the form be here?
                  ) => Promise.resolve(val.Confirmation),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.PENDING_STUDENT }, //If school accepts, then it's pending the students answer
          [DefaultEvents.REJECT]: { target: States.SCHOOL_REJECTED },
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
  },
}

export default template
