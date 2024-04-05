import {
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  FormModes,
  HealthInsuranceApi,
  InstitutionNationalIds,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { application } from './messages/application'
import { HealthInsuranceDeclarationSchema } from './dataSchema'
import { States } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'

type HealthInsuranceDeclarationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION = 'organization',
}
const configuration =
  ApplicationConfigurations[ApplicationTypes.HEALTH_INSURANCE_DECLARATION]

const HealthInsuranceDeclarationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<HealthInsuranceDeclarationEvent>,
  HealthInsuranceDeclarationEvent
> = {
  type: ApplicationTypes.HEALTH_INSURANCE_DECLARATION,
  name: application.general.name,
  translationNamespaces: configuration.translation,
  dataSchema: HealthInsuranceDeclarationSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: application.general.name.defaultMessage,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
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
                HealthInsuranceApi,
                UserProfileApi,
                NationalRegistryUserApi,
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
    },
  },
  mapUserToRole: (nationalId, application) => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    if (nationalId === InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS) {
      return Roles.ORGANIZATION
    }
    return undefined
  },
}

export default HealthInsuranceDeclarationTemplate
