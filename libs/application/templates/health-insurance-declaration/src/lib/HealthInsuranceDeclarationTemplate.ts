import {
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  FormModes,
  InstitutionNationalIds,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { application } from './messages/application'
import { HealthInsuranceDeclarationSchema } from './dataSchema'
import { ApiActions, States } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

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
  codeOwner: CodeOwners.NordaApplications,
  translationNamespaces: configuration.translation,
  dataSchema: HealthInsuranceDeclarationSchema,
  institution: application.general.institutionName,
  featureFlag: Features.HealthInsuranceDeclaration,
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
                defineTemplateApi({
                  action: 'getInsuranceStatementData',
                  namespace: 'HealthInsuranceDeclaration',
                  externalDataId: 'insuranceStatementData',
                }),
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
                import('../forms/healthInsuranceDeclarationForm/index').then(
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
          name: application.general.name.defaultMessage,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Submitted').then((val) =>
                  Promise.resolve(val.HealthInsuranceDeclarationSubmitted),
                ),
              write: 'all',
              api: [
                defineTemplateApi({
                  action: 'getPdfDataForApplicants',
                  namespace: 'HealthInsuranceDeclaration',
                  externalDataId: 'pdfDataForApplicants',
                  shouldPersistToExternalData: false,
                }),
              ],
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
