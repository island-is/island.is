import {
  ApplicationContext,
  ApplicationConfigurations,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  NationalRegistryCohabitantsApi,
  defineTemplateApi,
} from '@island.is/application/types'
import {
  HealthInsuranceApi,
  NationalRegistryUserApi,
  UserProfileApi,
  HealthCenterApi,
} from '../dataProviders'
import { application } from './messages'
import { HomeSupportSchema } from './dataSchema'
import { States, TWENTY_FOUR_HOURS_IN_MS } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import { isEligibleForApplication } from '../utils'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

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
  codeOwner: CodeOwners.NordaApplications,
  dataSchema: HomeSupportSchema,
  translationNamespaces: configuration.translation,
  featureFlag: Features.homeSupport,
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
                NationalRegistryCohabitantsApi,
                HealthInsuranceApi,
                HealthCenterApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.DRAFT,
              cond: isEligibleForApplication,
            },
            {
              target: States.NOT_ELIGIBLE,
            },
          ],
        },
      },
      [States.NOT_ELIGIBLE]: {
        meta: {
          status: 'rejected',
          name: application.general.name.defaultMessage,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: TWENTY_FOUR_HOURS_IN_MS,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/NotEligible').then((val) =>
                  Promise.resolve(val.NotEligible),
                ),
              delete: true,
              read: 'all',
            },
          ],
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
            target: States.SUBMITTED,
          },
        },
      },
      [States.SUBMITTED]: {
        meta: {
          status: 'completed',
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: 'submitApplication',
            shouldPersistToExternalData: true,
          }),
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
