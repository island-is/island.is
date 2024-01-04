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
          name: 'Skilyrði',
          status: 'draft',
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
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: TWENTY_FOUR_HOURS_IN_MS,
          },
        },
        on: {
          SUBMIT: {
            target: States.DRAFT,
          },
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
