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
  externalData,
  overview,
} from './messages'
import { SecondarySchoolSchema } from './dataSchema'
import {
  NationalRegistryParentsApi,
  NationalRegistryUserApi,
  SchoolsApi,
  StudentInfoApi,
  UserProfileApiWithValidation,
} from '../dataProviders'
import { Features } from '@island.is/feature-flags'
import {
  Events,
  States,
  Roles,
  ApiActions,
  getEndOfDayUTCDate,
  getLastRegistrationEndDate,
} from '../utils'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { assign } from 'xstate'
import set from 'lodash/set'

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
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.SecondarySchool.translation,
  ],
  dataSchema: SecondarySchoolSchema,
  featureFlag: Features.SecondarySchoolEnabled,
  allowedDelegations: [
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
          onExit: defineTemplateApi({
            action: ApiActions.validateCanCreate,
          }),
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
                NationalRegistryParentsApi,
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
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.SUBMITTED },
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
              pruneInDaysAfterRegistrationCloses(application, 30),
          },
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          onExit: defineTemplateApi({
            action: ApiActions.deleteApplication,
            triggerEvent: DefaultEvents.EDIT,
          }),
          onDelete: defineTemplateApi({
            action: ApiActions.deleteApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardSubmitted,
              variant: 'blueberry',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: applicationMessage.historyAplicationEdited,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationReceived,
              },
            ],
            pendingAction: {
              title: corePendingActionMessages.waitingForReviewTitle,
              content: corePendingActionMessages.waitingForReviewDescription,
              displayStatus: 'info',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/submittedForm').then((module) =>
                  Promise.resolve(module.Submitted),
                ),
              read: 'all',
              delete: true,
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.buttons.submit,
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
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
              title: corePendingActionMessages.applicationReceivedTitle,
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
