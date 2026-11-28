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
  FormModes,
  InstitutionNationalIds,
  VerifyPaymentApi,
} from '@island.is/application/types'
import { buildPaymentState } from '@island.is/application/utils'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import {
  IdentityApi,
  WorkMachineLicenseApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  UserProfileApiWithValidation,
  VinnueftirlitidPaymentCatalogApi,
} from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../utils/constants'
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
          name: States.PREREQUISITES,
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
                WorkMachineLicenseApi,
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
          name: States.DRAFT,
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
        submitTarget: States.SUBMITTED,
        showSubmitErrorReason: true,
        onExit: [
          VerifyPaymentApi.configure({
            triggerEvent: DefaultEvents.SUBMIT,
          }),
          defineTemplateApi({
            action: ApiActions.verifyPaymentReceived,
            order: 1,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.SUBMITTED]: {
        meta: {
          name: States.SUBMITTED,
          progress: 1,
          status: FormModes.IN_PROGRESS,
          lifecycle: pruneAfterDays(365),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessages.actionCardSubmitted,
              variant: 'blueberry',
            },
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              content: applicationMessages.pendingActionSubmittedDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationApproved,
                onEvent: DefaultEvents.APPROVE,
              },
              {
                logMessage: coreHistoryMessages.applicationRejected,
                onEvent: DefaultEvents.REJECT,
              },
            ],
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
            {
              id: Roles.ORGANIZATION,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.REJECT,
                  name: 'Hafna',
                  type: 'reject',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          progress: 1,
          status: FormModes.APPROVED,
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.sendApprovedNotification,
            throwOnError: false,
          }),
          actionCard: {
            tag: {
              label: applicationMessages.actionCardApproved,
              variant: 'mint',
            },
            pendingAction: {
              title: coreHistoryMessages.applicationApproved,
              content: applicationMessages.pendingActionApprovedDescription,
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
      [States.REJECTED]: {
        meta: {
          name: States.REJECTED,
          progress: 1,
          status: FormModes.REJECTED,
          lifecycle: pruneAfterDays(30),
          actionCard: {
            tag: {
              label: applicationMessages.actionCardRejected,
              variant: 'red',
            },
            pendingAction: {
              title: coreHistoryMessages.applicationRejected,
              content: applicationMessages.pendingActionRejectedDescription,
              displayStatus: 'error',
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
    if (nationalId === InstitutionNationalIds.VINNUEFTIRLITID) {
      return Roles.ORGANIZATION
    }
    return undefined
  },
}

export default template
