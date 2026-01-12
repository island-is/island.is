import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  FormModes,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  application as applicationMessage,
  historyMessages as applicationHistoryMessages,
  pendingActionMessages as applicationPendingActionMessages,
  externalData,
  overview,
} from './messages'
import { SecondarySchoolSchema } from './dataSchema'
import {
  NationalRegistryCustodiansApi,
  NationalRegistryUserApi,
  SchoolsApi,
  StudentInfoApi,
  UserProfileApiWithValidation,
} from '../dataProviders'
import {
  Events,
  States,
  Roles,
  ApiActions,
  getEndOfDayUTCDate,
  getLastRegistrationEndDate,
  ApplicationEvents,
} from '../utils'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { assign } from 'xstate'
import set from 'lodash/set'
import { CodeOwners } from '@island.is/shared/constants'

const pruneInDaysAfterRegistrationCloses = (
  application: Application,
  days: number,
) => {
  const lastRegistrationEndDate = getLastRegistrationEndDate(
    application.answers,
  )

  // add days to registration end date
  const date = lastRegistrationEndDate
    ? new Date(lastRegistrationEndDate)
    : new Date()
  date.setDate(date.getDate() + days)

  // set time to right before midnight
  return getEndOfDayUTCDate(date)
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SECONDARY_SCHOOL,
  name: applicationMessage.name,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces: ApplicationConfigurations.SecondarySchool.translation,
  dataSchema: SecondarySchoolSchema,
  allowMultipleApplicationsInDraft: false,
  allowedDelegations: [
    {
      type: AuthDelegationType.LegalGuardian,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.menntamalastofnun],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: applicationMessage.stateMetaNamePrerequisites.defaultMessage,
          progress: 0,
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationStarted,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: externalData.dataProvider.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                NationalRegistryCustodiansApi,
                UserProfileApiWithValidation,
                SchoolsApi,
                StudentInfoApi,
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
          name: applicationMessage.stateMetaNameDraft.defaultMessage,
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationSent,
              },
            ],
          },
          lifecycle: pruneAfterDays(7),
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/secondarySchoolForm/index').then((module) =>
                  Promise.resolve(module.SecondarySchoolForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.buttons.submit,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [SchoolsApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.SUBMITTED },
        },
      },
      [States.EDIT]: {
        entry: ['assignToInstitution'],
        exit: ['clearAssignees'],
        meta: {
          name: applicationMessage.stateMetaNameEdit.defaultMessage,
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardEdit,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationSent,
              },
              {
                onEvent: DefaultEvents.ABORT,
                logMessage: applicationHistoryMessages.changesAborted,
              },
              {
                onEvent: ApplicationEvents.REVIEW_STARTED,
                logMessage: coreHistoryMessages.applicationReceived,
              },
              {
                onEvent: ApplicationEvents.REVIEW_COMPLETED,
                logMessage: applicationHistoryMessages.reviewFinished,
              },
              {
                onEvent: ApplicationEvents.APPLICATION_DISMISSED,
                logMessage: applicationHistoryMessages.applicationDismissed,
              },
            ],
          },
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAfterRegistrationCloses(application, 2 * 30),
          },
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
          onDelete: defineTemplateApi({
            action: ApiActions.deleteApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/editForm').then((module) =>
                  Promise.resolve(module.Edit),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.buttons.submit,
                  type: 'primary',
                },
                {
                  event: DefaultEvents.ABORT,
                  name: overview.buttons.abort,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [SchoolsApi],
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: ApplicationEvents.REVIEW_STARTED,
                  name: overview.buttons.received,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.REVIEW_COMPLETED,
                  name: overview.buttons.received,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.APPLICATION_DISMISSED,
                  name: overview.buttons.dismissed,
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.SUBMITTED },
          [DefaultEvents.ABORT]: { target: States.SUBMITTED },
          [ApplicationEvents.REVIEW_STARTED]: {
            target: States.IN_REVIEW_FROM_EDIT,
          },
          [ApplicationEvents.REVIEW_COMPLETED]: { target: States.COMPLETED },
          [ApplicationEvents.APPLICATION_DISMISSED]: {
            target: States.DISMISSED,
          },
        },
      },
      [States.SUBMITTED]: {
        entry: ['assignToInstitution'],
        exit: ['clearAssignees'],
        meta: {
          name: applicationMessage.stateMetaNameSubmitted.defaultMessage,
          status: FormModes.IN_PROGRESS,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAfterRegistrationCloses(application, 2 * 30),
          },
          onDelete: defineTemplateApi({
            action: ApiActions.deleteApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardSubmitted,
              variant: 'blueberry',
            },
            pendingAction: {
              title: applicationPendingActionMessages.waitingForReviewTitle,
              content: corePendingActionMessages.waitingForReviewDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: applicationHistoryMessages.edited,
              },
              {
                onEvent: ApplicationEvents.REVIEW_STARTED,
                logMessage: coreHistoryMessages.applicationReceived,
              },
              {
                onEvent: ApplicationEvents.REVIEW_COMPLETED,
                logMessage: applicationHistoryMessages.reviewFinished,
              },
              {
                onEvent: ApplicationEvents.APPLICATION_DISMISSED,
                logMessage: applicationHistoryMessages.applicationDismissed,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/submittedForm').then((module) =>
                  Promise.resolve(module.Submitted),
                ),
              read: 'all',
              write: {
                answers: ['copy'],
              },
              delete: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: overview.buttons.edit,
                  type: 'primary',
                },
              ],
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: ApplicationEvents.REVIEW_STARTED,
                  name: overview.buttons.received,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.REVIEW_COMPLETED,
                  name: overview.buttons.received,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.APPLICATION_DISMISSED,
                  name: overview.buttons.dismissed,
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.EDIT },
          [ApplicationEvents.REVIEW_STARTED]: { target: States.IN_REVIEW },
          [ApplicationEvents.REVIEW_COMPLETED]: { target: States.COMPLETED },
          [ApplicationEvents.APPLICATION_DISMISSED]: {
            target: States.DISMISSED,
          },
        },
      },
      [States.IN_REVIEW]: {
        entry: ['assignToInstitution'],
        exit: ['clearAssignees'],
        meta: {
          name: applicationMessage.stateMetaNameInReview.defaultMessage,
          status: FormModes.IN_PROGRESS,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAfterRegistrationCloses(application, 3 * 30),
          },
          actionCard: {
            tag: {
              label: applicationMessage.actionCardInReview,
              variant: 'blueberry',
            },
            pendingAction: {
              title: applicationPendingActionMessages.inReviewTitle,
              content: applicationPendingActionMessages.inReviewDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: ApplicationEvents.REVIEW_WITHDRAWN,
                logMessage: applicationHistoryMessages.reviewWithdrawn,
              },
              {
                onEvent: ApplicationEvents.REVIEW_COMPLETED,
                logMessage: applicationHistoryMessages.reviewFinished,
              },
              {
                onEvent: ApplicationEvents.APPLICATION_DISMISSED,
                logMessage: applicationHistoryMessages.applicationDismissed,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: ApplicationEvents.REVIEW_WITHDRAWN,
                  name: overview.buttons.withdrawn,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.REVIEW_COMPLETED,
                  name: overview.buttons.received,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.APPLICATION_DISMISSED,
                  name: overview.buttons.dismissed,
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [ApplicationEvents.REVIEW_WITHDRAWN]: { target: States.SUBMITTED },
          [ApplicationEvents.REVIEW_COMPLETED]: { target: States.COMPLETED },
          [ApplicationEvents.APPLICATION_DISMISSED]: {
            target: States.DISMISSED,
          },
        },
      },
      [States.IN_REVIEW_FROM_EDIT]: {
        entry: ['assignToInstitution'],
        exit: ['clearAssignees'],
        meta: {
          name: applicationMessage.stateMetaNameInReview.defaultMessage,
          status: FormModes.IN_PROGRESS,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAfterRegistrationCloses(application, 3 * 30),
          },
          actionCard: {
            tag: {
              label: applicationMessage.actionCardInReview,
              variant: 'blueberry',
            },
            pendingAction: {
              title: applicationPendingActionMessages.inReviewTitle,
              content: applicationPendingActionMessages.inReviewDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: ApplicationEvents.REVIEW_WITHDRAWN,
                logMessage: applicationHistoryMessages.reviewWithdrawn,
              },
              {
                onEvent: ApplicationEvents.REVIEW_COMPLETED,
                logMessage: applicationHistoryMessages.reviewFinished,
              },
              {
                onEvent: ApplicationEvents.APPLICATION_DISMISSED,
                logMessage: applicationHistoryMessages.applicationDismissed,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: ApplicationEvents.REVIEW_WITHDRAWN,
                  name: overview.buttons.withdrawn,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.REVIEW_COMPLETED,
                  name: overview.buttons.received,
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.APPLICATION_DISMISSED,
                  name: overview.buttons.dismissed,
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [ApplicationEvents.REVIEW_WITHDRAWN]: { target: States.EDIT },
          [ApplicationEvents.REVIEW_COMPLETED]: { target: States.COMPLETED },
          [ApplicationEvents.APPLICATION_DISMISSED]: {
            target: States.DISMISSED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: applicationMessage.stateMetaNameCompleted.defaultMessage,
          status: FormModes.COMPLETED,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAfterRegistrationCloses(application, 3 * 30),
          },
          actionCard: {
            tag: {
              label: applicationMessage.actionCardCompleted,
              variant: 'blueberry',
            },
            pendingAction: {
              title: applicationPendingActionMessages.reviewFinishedTitle,
              content:
                applicationPendingActionMessages.reviewFinishedDescription,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.Completed),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.DISMISSED]: {
        meta: {
          name: applicationMessage.stateMetaNameDismissed.defaultMessage,
          status: FormModes.COMPLETED,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAfterRegistrationCloses(application, 3 * 30),
          },
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDismissed,
              variant: 'blueberry',
            },
          },
        },
      },
    },
  },
  mapUserToRole: (nationalId: string, application: Application) => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    } else if (
      nationalId === InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU
    ) {
      return Roles.ORGANISATION_REVIEWER
    }
    return undefined
  },
  stateMachineOptions: {
    actions: {
      assignToInstitution: assign((context) => {
        const { application } = context
        set(application, 'assignees', [
          InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
        ])
        return context
      }),
      clearAssignees: assign((context) => {
        const { application } = context
        set(application, 'assignees', [])
        return context
      }),
    },
  },
}

export default template
