import {
  Application,
  ApplicationContext,
  ApplicationConfigurations,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  PendingAction,
} from '@island.is/application/types'
import {
  HealthInsuranceApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'
import { application } from './messages'
import { HomeSupportSchema } from './dataSchema'
import { States, TWENTY_FOUR_HOURS_IN_MS } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'

type HomeSupportEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum Roles {
  APPLICANT = 'applicant',
}

const configuration = ApplicationConfigurations[ApplicationTypes.HOME_SUPPORT]

const HomeSupportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<HomeSupportEvent>,
  HomeSupportEvent
> = {
  type: ApplicationTypes.HOME_SUPPORT,
  name: application.general.name,
  dataSchema: HomeSupportSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: application.general.name.defaultMessage,
          status: 'draft',
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: TWENTY_FOUR_HOURS_IN_MS,
          },
          actionCard: {
            historyLogs: {
              logMessage: coreHistoryMessages.applicationStarted,
              onEvent: DefaultEvents.SUBMIT,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                UserProfileApi,
                NationalRegistryUserApi,
                HealthInsuranceApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          status: 'draft',
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            historyLogs: {
              logMessage: coreHistoryMessages.applicationSent,
              onEvent: DefaultEvents.SUBMIT,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/HomeSupportForm').then((module) =>
                  Promise.resolve(module.HomeSupportForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        meta: {
          status: 'completed',
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
        },
      },
    },
  },
  mapUserToRole: (nationalId, application) => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default HomeSupportTemplate
