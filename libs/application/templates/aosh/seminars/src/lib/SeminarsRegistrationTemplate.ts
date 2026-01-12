import {
  coreHistoryMessages,
  corePendingActionMessages,
  EphemeralStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultEvents,
  UserProfileApi,
  ApplicationConfigurations,
  Application,
  defineTemplateApi,
  InstitutionNationalIds,
  FormModes,
} from '@island.is/application/types'
import { SeminarAnswersSchema } from './dataSchema'
import {
  getIndividualValidityApi,
  getSeminarsApi,
  IdentityApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  VinnueftirlitidPaymentCatalogApi,
} from '../dataProviders'
import { application as applicationMessage } from './messages'
import { buildPaymentState } from '@island.is/application/utils'
import { getChargeItems } from '../utils'
import { ApiScope } from '@island.is/auth/scopes'
import { CodeOwners } from '@island.is/shared/constants'
import {
  ApiActions,
  Events,
  PaymentOptions,
  Roles,
  States,
} from '../shared/types'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SEMINAR_REGISTRATION,
  name: applicationMessage.name,
  institution: applicationMessage.institutionName,
  translationNamespaces:
    ApplicationConfigurations.SeminarRegistration.translation,
  codeOwner: CodeOwners.Origo,
  initialQueryParameter: 'seminarId',
  dataSchema: SeminarAnswersSchema,
  requiredScopes: [ApiScope.vinnueftirlitid],
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
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
                VinnueftirlitidPaymentCatalogApi,
                MockableVinnueftirlitidPaymentCatalogApi,
                getSeminarsApi,
                getIndividualValidityApi,
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
          name: 'Skráning á námskeið hjá Vinnueftirlitinu',
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
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
            whenToPrune: 30 * 24 * 3600 * 1000, // 30 days,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/SeminarRegistrationForm/index').then(
                  (module) => Promise.resolve(module.SeminarRegistrationForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: applicationMessage.confirmButtonLabel,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.COMPLETED,
              cond: ({ application }: ApplicationContext) => {
                const paymentOptions = getValueViaPath<PaymentOptions>(
                  application.answers,
                  'paymentArrangement.paymentOptions',
                )
                return paymentOptions === PaymentOptions.putIntoAccount
              },
            },
            {
              target: States.PAYMENT,
            },
          ],
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
          status: FormModes.COMPLETED,
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDone,
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
  stateMachineOptions: {},
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
