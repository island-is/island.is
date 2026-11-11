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
  FormModes,
  InstitutionNationalIds,
  VerifyPaymentApi,
} from '@island.is/application/types'
import { buildPaymentState } from '@island.is/application/utils'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import {
  IdentityApi,
  MachineLicenseRightsApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  UserProfileApiWithValidation,
  VinnueftirlitidPaymentCatalogApi,
} from '../dataProviders'
import { Events, Roles, States } from '../utils/constants'
import { getChargeItems } from '../utils/getChargeItems'
import { dataSchema } from './dataSchema'
import { application as applicationMessages, prerequisites } from './messages'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MACHINE_LICENSE_RENEWAL,
  name: applicationMessages.name,
  codeOwner: CodeOwners.Deloitte,
  institution: applicationMessages.institutionName,
  translationNamespaces:
    ApplicationConfigurations.MachineLicenseRenewal.translation,
  dataSchema,
  featureFlag: Features.machineLicenseRenewal,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: prerequisites.general.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                IdentityApi,
                UserProfileApiWithValidation,
                MachineLicenseRightsApi,
                VinnueftirlitidPaymentCatalogApi,
                MockableVinnueftirlitidPaymentCatalogApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Endurnýjun vinnuvélaskírteinis',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: pruneAfterDays(30),
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
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
        onExit: [
          // TODO: Confirm the payment with Vinnueftirlitið before moving to the completed state
          VerifyPaymentApi.configure({
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: pruneAfterDays(30),
          // TODO: Add an onEntry submit action that sends the renewal to Vinnueftirlitið once their renewal endpoint exists
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
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
