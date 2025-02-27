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
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles, ApiActions } from './constants'
import { AuthDelegationType } from '@island.is/shared/types'
import { TrainingLicenseOnAWorkMachineAnswersSchema } from './dataSchema'
import { application as applicationMessage } from './messages'
import {
  IdentityApi,
  LicensesApi,
  RegistrationNumberPrefixApi,
  UserProfileApiWithValidation,
} from '../dataProviders'
import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'
import { assign } from 'xstate'
import set from 'lodash/set'
import { CodeOwners } from '@island.is/shared/constants'

const pruneInDaysAtMidnight = (application: Application, days: number) => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  const pruneDate = new Date(date)
  pruneDate.setUTCHours(23, 59, 59)
  return pruneDate
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TRAINING_LICENSE_ON_A_WORK_MACHINE,
  name: applicationMessage.name,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces:
    ApplicationConfigurations[
      ApplicationTypes.TRAINING_LICENSE_ON_A_WORK_MACHINE
    ].translation,
  dataSchema: TrainingLicenseOnAWorkMachineAnswersSchema,
  featureFlag: Features.TrainingLicenseOnAWorkMachineEnabled,
  allowedDelegations: [
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.vinnueftirlitid],
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
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [
                IdentityApi,
                UserProfileApiWithValidation,
                RegistrationNumberPrefixApi,
                LicensesApi,
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
          name: 'Kennsluréttindi á vinnuvél',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: coreHistoryMessages.applicationAssigned,
                onEvent: DefaultEvents.ASSIGN,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/TrainingLicenseOnAWorkMachineForm/index').then(
                  (module) =>
                    Promise.resolve(module.TrainingLicenseOnAWorkMachineForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.ASSIGN,
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
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
          [DefaultEvents.ASSIGN]: { target: States.REVIEW },
        },
      },
      [States.REVIEW]: {
        entry: 'assignUsers',
        meta: {
          name: 'Kennsluréttindi á vinnuvél',
          status: 'inprogress',
          onDelete: defineTemplateApi({
            action: ApiActions.deleteApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardReview,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationApproved,
              },
            ],
          },
          lifecycle: {
            pruneMessage: {
              notificationTemplateId: 'HNIPP.AS.VER.TLWM.PRUNED',
            },
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application) => pruneInDaysAtMidnight(application, 7),
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantReview').then((module) =>
                  Promise.resolve(module.ApplicantReview),
                ),
              write: {
                answers: [],
              },
              read: 'all',
              delete: true,
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ReviewForm').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              write: {
                answers: ['rejected'],
              },
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
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
                import('../forms/Conclusion').then((module) =>
                  Promise.resolve(module.Conclusion),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/AssigneeConclusion').then((module) =>
                  Promise.resolve(module.AssigneeConclusion),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          status: 'rejected',
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.rejectApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardRejected,
              variant: 'blueberry',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((module) =>
                  Promise.resolve(module.Rejected),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/Rejected').then((module) =>
                  Promise.resolve(module.Rejected),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignUsers: assign((context) => {
        const { application } = context

        const assigneeNationalId = getValueViaPath<string>(
          application.answers,
          'assigneeInformation.assignee.nationalId',
          '',
        )
        if (assigneeNationalId !== null && assigneeNationalId !== '') {
          set(application, 'assignees', [assigneeNationalId])
        }
        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const assigneeNationalId = getValueViaPath<string>(
      application.answers,
      'assigneeInformation.assignee.nationalId',
      '',
    )
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (id === assigneeNationalId && application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default template
