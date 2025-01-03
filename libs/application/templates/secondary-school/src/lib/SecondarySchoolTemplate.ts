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
  UserProfileApi,
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
                UserProfileApi,
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
            action: ApiActions.validateCanCreate,
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
                  name: overview.buttons.confirm,
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
                import('../forms/conclusionForm').then((module) =>
                  Promise.resolve(module.Conclusion),
                ),
              read: 'all',
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
                import('../forms/conclusionForm').then((module) =>
                  Promise.resolve(module.Conclusion),
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
