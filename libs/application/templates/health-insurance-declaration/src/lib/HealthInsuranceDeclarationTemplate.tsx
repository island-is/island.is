import {
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  FormModes,
  HealthInsuranceApi,
  InstitutionNationalIds,
  NationalRegistrySpouseApi,
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
                ChildrenCustodyInformationApi,
                NationalRegistrySpouseApi,
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
          status: FormModes.DRAFT,
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
                import('../forms/HealthInsuranceDeclarationForm').then(
                  (module) =>
                    Promise.resolve(module.HealthInsuranceDeclarationForm),
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
          name: States.SUBMITTED,
          progress: 1,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Submitted').then((val) =>
                  Promise.resolve(val.HealthInsuranceDeclarationSubmitted),
                ),
            },
          ],
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
