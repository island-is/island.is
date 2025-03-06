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
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Roles, States, Events } from './constants'
import { buildPaymentState } from '@island.is/application/utils'
import { PracticalExamAnswersSchema } from './dataSchema'
import {
  IdentityApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  VinnueftirlitidPaymentCatalogApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { shared } from './messages/shared'
import { getChargeItems, isCompany } from '../utils'
import { PaymentOptions } from '../shared/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PRACTICAL_EXAM,
  name: shared.application.name,
  codeOwner: CodeOwners.Origo,
  institution: shared.application.institutionName,
  translationNamespaces: ApplicationConfigurations.PracticalExam.translation,
  dataSchema: PracticalExamAnswersSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.vinnueftirlitid],
  featureFlag: Features.PracticalExamEnabled,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          actionCard: {
            tag: {
              label: shared.application.actionCardPrerequisites,
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
          name: 'Skráning í verklegt próf',
          status: 'draft',
          actionCard: {
            tag: {
              label: shared.application.actionCardDraft,
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
                import('../forms/PracticalExamForm/index').then((module) =>
                  Promise.resolve(module.PracticalExamForm),
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
          [DefaultEvents.SUBMIT]: [
            {
              target: States.COMPLETED,
              cond: ({ application }: ApplicationContext) => {
                const paymentOptions = getValueViaPath<PaymentOptions>(
                  application.answers,
                  'paymentArrangement.paymentOptions',
                )
                return (
                  paymentOptions === PaymentOptions.putIntoAccount &&
                  isCompany(application.answers)
                )
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
        // onExit: [
        //   defineTemplateApi({
        //     action: ApiActions.submitApplication,
        //     triggerEvent: DefaultEvents.SUBMIT,
        //   }),
        // ],
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(30),
          // onEntry: defineTemplateApi({
          //   action: ApiActions.submitApplication
          // }),
          actionCard: {
            title: 'Akureyri 123',
            description: 'Akureyri',
            tag: {
              //label: shared.application.actionCardDone,
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
