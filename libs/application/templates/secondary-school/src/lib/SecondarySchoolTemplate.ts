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
import { Events, States, Roles, ApiActions } from './constants'
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
  UserProfileApi,
} from '../dataProviders'
import { Features } from '@island.is/feature-flags'
import { getEndOfDayUTC, getLastRegistrationEndDate } from '../utils'
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
  return getEndOfDayUTC(date)
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
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
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
                import('../forms/Prerequisites').then((module) =>
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
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
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
                import('../forms/SecondarySchoolForm/index').then((module) =>
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
                import('../forms/Conclusion').then((module) =>
                  Promise.resolve(module.Conclusion),
                ),
              read: 'all',
              delete: true,
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
