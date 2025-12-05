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
  FormModes,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  getReviewStatePendingAction,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles, ApiActions } from './constants'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  TrainingLicenseOnAWorkMachineAnswers,
  TrainingLicenseOnAWorkMachineAnswersSchema,
} from './dataSchema'
import {
  application as applicationMessage,
  externalData,
  overview,
} from './messages'
import {
  IdentityApi,
  LicensesApi,
  RegistrationNumberPrefixApi,
  UserProfileApiWithValidation,
} from '../dataProviders'
import { ApiScope } from '@island.is/auth/scopes'
import { assign } from 'xstate'
import set from 'lodash/set'
import { CodeOwners } from '@island.is/shared/constants'
import { getReviewers, hasReviewerApproved } from '../utils'

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
  allowedDelegations: [
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.vinnueftirlitid],
  adminDataConfig: {
    answers: [
      // fields that we need to keep after pruning for pending action to work properly
      { key: 'assigneeInformation.$.assignee.nationalId', isListed: false },
      { key: 'approved', isListed: false },
    ],
  },
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: externalData.dataProvider.sectionTitle.defaultMessage,
          status: FormModes.DRAFT,
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
          name: applicationMessage.name.defaultMessage,
          status: FormModes.DRAFT,
          onExit: defineTemplateApi({
            action: ApiActions.initReview,
            triggerEvent: DefaultEvents.ASSIGN,
          }),
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
                logMessage: applicationMessage.historyLogInReview,
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
          name: applicationMessage.name.defaultMessage,
          status: FormModes.DRAFT,
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
                includeSubjectAndActor: true,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationApproved,
                includeSubjectAndActor: true,
              },
            ],
            pendingAction: (application, _role, nationalId) => {
              return getReviewStatePendingAction(
                hasReviewerApproved(application.answers, nationalId),
                getReviewers(application.answers),
              )
            },
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
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.general.approveButton,
                  type: 'primary',
                },
                {
                  event: DefaultEvents.REJECT,
                  name: overview.general.rejectButton,
                  type: 'primary',
                },
              ],
              write: {
                answers: ['rejected', 'approved'],
              },
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.REVIEW },
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

        const assignees = getNationalIdListOfAssignees(application)
        if (assignees.length > 0) {
          set(application, 'assignees', assignees)
        }
        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { assignees, applicant } = application
    if (id === applicant) {
      return Roles.APPLICANT
    }
    if (assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default template

const getNationalIdListOfAssignees = (application: Application) => {
  const assigneeInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
  >(application.answers, 'assigneeInformation')
  const assignees = assigneeInformation?.map(
    ({ assignee }) => assignee.nationalId,
  )
  return assignees ?? []
}
