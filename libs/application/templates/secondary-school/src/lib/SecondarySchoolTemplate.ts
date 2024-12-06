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
import { Events, States, Roles, ApiActions } from './constants'
import { application, application as applicationMessage } from './messages'
import { SecondarySchoolSchema } from './dataSchema'
import {
  NationalRegistryParentsApi,
  NationalRegistryUserApi,
  SchoolsApi,
  UserProfileApi,
} from '../dataProviders'
import { Features } from '@island.is/feature-flags'
import { SecondarySchoolAnswers } from '..'

const pruneInDaysAfterRegistrationCloses = (
  application: Application,
  days: number,
) => {
  const answers = application.answers as SecondarySchoolAnswers

  // get the last regirastion date out of all the programs selected
  const lastRegistrationEndDate = [
    answers?.selection?.first?.firstProgram?.registrationEndDate,
    answers?.selection?.first?.secondProgram?.registrationEndDate,
    answers?.selection?.second?.firstProgram?.registrationEndDate,
    answers?.selection?.second?.secondProgram?.registrationEndDate,
    answers?.selection?.third?.firstProgram?.registrationEndDate,
    answers?.selection?.third?.secondProgram?.registrationEndDate,
  ]
    .filter((x) => !!x)
    .map((x) => (x ? new Date(x) : new Date()))
    .sort((a, b) => b.getTime() - a.getTime())[0] // descending order

  // add days to registration end date
  const date = lastRegistrationEndDate
    ? new Date(lastRegistrationEndDate)
    : new Date()
  date.setDate(date.getDate() + days)

  // set time to right before midnight
  const pruneDate = new Date(date.toUTCString())
  pruneDate.setHours(23, 59, 59)
  return pruneDate
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SECONDARY_SCHOOL,
  name: application.name,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.SecondarySchool.translation,
  ],
  dataSchema: SecondarySchoolSchema,
  //TODOx should allow delegation?
  featureFlag: Features.SecondarySchoolEnabled,
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
          onEntry: defineTemplateApi({
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
                  name: 'Staðfesta',
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
          name: 'Umsókn um framhaldsskóla',
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
            ],
          },
          lifecycle: pruneAfterDays(1), //TODOx ef hægt að fá sameiginlegt registrationEndDate fyrir alla, væri gott að setja það inn hér
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
