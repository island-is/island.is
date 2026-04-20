import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  HealthInsuranceApi,
  UserProfileApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { m } from './messages/messages'
import { dataSchema } from './dataSchema'
import { ApiModule } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { ApiScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'

type Events = { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

enum ApplicationStates {
  PREREQUESITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
}

const applicationName = m.formTitle.defaultMessage

const configuration =
  ApplicationConfigurations[ApplicationTypes.HEALTH_INSURANCE]

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: applicationName,
  codeOwner: CodeOwners.NordaApplications,
  dataSchema,
  translationNamespaces: configuration.translation,
  allowMultipleApplicationsInDraft: false,
  allowedDelegations: [
    {
      type: AuthDelegationType.Custom,
    },
    {
      type: AuthDelegationType.LegalRepresentative,
    },
    {
      type: AuthDelegationType.GeneralMandate,
    },
  ],
  requiredScopes: [ApiScope.icelandHealth],
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUESITES,
    states: {
      [ApplicationStates.PREREQUESITES]: {
        meta: {
          name: applicationName,
          status: 'draft',
          progress: 0,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // If application stays in this state for 24 hours it will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
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
                import('../forms/PrerequsitesForm/PrerequisitesForm').then(
                  (module) => Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
              api: [
                NationalRegistryV3UserApi,
                HealthInsuranceApi,
                UserProfileApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: { target: ApplicationStates.DRAFT },
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          status: 'draft',
          name: applicationName,
          progress: 0.25,
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
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
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
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        meta: {
          status: 'completed',
          name: applicationName,
          onEntry: defineTemplateApi({
            action: ApiModule.sendApplyHealthInsuranceApplication,
          }),
          actionCard: {
            pendingAction: {
              title: coreHistoryMessages.applicationReceived,
              content: m.actionCardSuccessFullSubmissionDescription,
              displayStatus: 'success',
            },
          },
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConclusionForm/ConclusionForm').then(
                  (module) => Promise.resolve(module.conclusionForm),
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

export default HealthInsuranceTemplate
