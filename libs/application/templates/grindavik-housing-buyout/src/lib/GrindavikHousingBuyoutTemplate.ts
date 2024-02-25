import {
  ApplicationContext,
  ApplicationConfigurations,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  checkResidence,
  grindaVikHousing,
} from '../dataProviders'
import { GrindavikHousingBuyoutSchema } from './dataSchema'
import { States, TWENTY_FOUR_HOURS_IN_MS } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { application } from './messages'

type GrindavikHousingBuyoutEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum Roles {
  APPLICANT = 'applicant',
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT]

const GrindavikHousingBuyoutTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<GrindavikHousingBuyoutEvent>,
  GrindavikHousingBuyoutEvent
> = {
  type: ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT,
  name: application.general.name,
  dataSchema: GrindavikHousingBuyoutSchema,
  translationNamespaces: [configuration.translation],
  featureFlag: Features.grindavikHousingBuyout,
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
                checkResidence,
                grindaVikHousing,
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
                import('../forms/GrindavikHousingBuyoutForm').then((module) =>
                  Promise.resolve(module.GrindavikHousingBuyoutForm),
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

export default GrindavikHousingBuyoutTemplate
