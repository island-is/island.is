import {
  coreHistoryMessages,
  corePendingActionMessages,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { buildPaymentState } from '@island.is/application/utils'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { CodeOwners } from '@island.is/shared/constants'
import { MachineLicenseCardReissueAnswersSchema } from './dataSchema'
import { application as applicationMessages } from './messages'
import {
  IdentityApi,
  LicensesApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  UserProfileApi,
  VinnueftirlitidPaymentCatalogApi,
} from '../dataProviders'
import { ApiActions, Roles, States } from '../shared'
import { getChargeItems } from '../utils/getChargeItems'

type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.ABORT }

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MACHINE_LICENSE_CARD_REISSUE,
  name: applicationMessages.name,
  codeOwner: CodeOwners.Deloitte,
  institution: applicationMessages.institutionName,
  translationNamespaces:
    ApplicationConfigurations[ApplicationTypes.MACHINE_LICENSE_CARD_REISSUE]
      .translation,
  dataSchema: MachineLicenseCardReissueAnswersSchema,
  allowedDelegations: [{ type: AuthDelegationType.Custom }],
  requiredScopes: [ApiScope.vinnueftirlitid],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Gagnaöflun',
          progress: 0,
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessages.actionCardPrerequisites,
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
                IdentityApi,
                UserProfileApi,
                LicensesApi,
                VinnueftirlitidPaymentCatalogApi,
                MockableVinnueftirlitidPaymentCatalogApi,
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
          name: applicationMessages.name.defaultMessage,
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessages.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 30 * 24 * 3600 * 1000, // 30 days
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/MachineLicenseCardReissueForm').then(
                  (module) =>
                    Promise.resolve(module.MachineLicenseCardReissueForm),
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
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
        chargeItems: getChargeItems,
        submitTarget: States.COMPLETED,
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessages.actionCardDone,
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
