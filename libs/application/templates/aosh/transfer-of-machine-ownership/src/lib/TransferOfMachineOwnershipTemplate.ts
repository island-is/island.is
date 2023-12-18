import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  PendingAction,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions } from '../shared'
import { AuthDelegationType } from '@island.is/shared/types'
import { MachineAnswersSchema } from './dataSchema'
import { application as applicationMessage } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'
import {
  IdentityApi,
  UserProfileApi,
  VinnueftirlitidPaymentCatalogApi,
  MachinesApi,
} from '../dataProviders'
import { getChargeItemCodes, hasReviewerApproved } from '../utils'
import { buildPaymentState } from '@island.is/application/utils'
import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'

const pruneInDaysAtMidnight = (application: Application, days: number) => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  const pruneDate = new Date(date.toUTCString())
  pruneDate.setHours(23, 59, 59)
  return pruneDate
}

const determineMessageFromApplicationAnswers = (application: Application) => {
  const regNumber = getValueViaPath(
    application.answers,
    'machine.regNumber',
    undefined,
  ) as string | undefined
  return {
    name: applicationMessage.name,
    value: regNumber ? `- ${regNumber}` : '',
  }
}

const reviewStatePendingAction = (
  application: Application,
  role: string,
  nationalId: string,
): PendingAction => {
  if (nationalId && !hasReviewerApproved(nationalId, application.answers)) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.waitingForReviewDescription,
      displayStatus: 'info',
    }
  }
}
const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP,
  name: determineMessageFromApplicationAnswers,
  institution: applicationMessage.institutionName,
  //featureFlag: Features.transferOfMachineOwnership,
  translationNamespaces: [
    ApplicationConfigurations.TransferOfMachineOwnership.translation,
  ],
  dataSchema: MachineAnswersSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.vinnueftirlitid],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Gagnaöflun',
          status: 'draft',
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
                  Promise.resolve(module.PrerequisitesForm),
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
              api: [
                IdentityApi,
                UserProfileApi,
                VinnueftirlitidPaymentCatalogApi,
                MachinesApi,
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
          name: 'Tilkynning um eigendaskipti að tæki',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/TransferOfMachineOwnershipForm/index').then(
                  (module) =>
                    Promise.resolve(module.TransferOfMachineOwnershipForm),
                ),
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
        chargeItemCodes: getChargeItemCodes,
        submitTarget: States.REVIEW,
        onExit: [
          defineTemplateApi({
            action: ApiActions.initReview,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.REVIEW]: {
        entry: 'assignUsers',
        meta: {
          name: 'Tilkynning um eigendaskipti að ökutæki',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: applicationMessage.historyLogApprovedByReviewer,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationApproved,
              },
            ],
            pendingAction: reviewStatePendingAction,
          },
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAtMidnight(application, 7),
            shouldDeleteChargeIfPaymentFulfilled: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ReviewSeller').then((module) =>
                  Promise.resolve(module.ReviewSellerForm),
                ),
              write: {
                answers: ['location', 'rejecter'],
              },
              read: 'all',
              delete: true,
            },
            {
              id: Roles.BUYER,
              formLoader: () =>
                import('../forms/Review').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              write: {
                answers: ['buyer', 'buyerOperator', 'location', 'rejecter'],
              },
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.REVIEW },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          status: 'rejected',
          lifecycle: pruneAfterDays(3 * 30),
          onEntry: defineTemplateApi({
            action: ApiActions.rejectApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardRejected,
              variant: 'red',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
              read: 'all',
            },
            {
              id: Roles.BUYER,
              formLoader: () =>
                import('../forms/Rejected').then((module) =>
                  Promise.resolve(module.Rejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(3 * 30),
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
                import('../forms/Approved').then((module) =>
                  Promise.resolve(module.Approved),
                ),
              read: 'all',
            },
            {
              id: Roles.BUYER,
              formLoader: () =>
                import('../forms/Approved').then((module) =>
                  Promise.resolve(module.Approved),
                ),
              read: 'all',
            },
            {
              id: Roles.BUYEROPERATOR,
              formLoader: () =>
                import('../forms/Approved').then((module) =>
                  Promise.resolve(module.Approved),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignUsers: assign((context) => {
        const { application } = context

        const buyerNationalId = getBuyerNationalId(application)
        if (buyerNationalId !== null && buyerNationalId !== '') {
          set(application, 'assignees', [buyerNationalId])
        }
        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string

    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (id === buyerNationalId && application.assignees.includes(id)) {
      return Roles.BUYER
    }

    return undefined
  },
}

export default template

const getBuyerNationalId = (application: Application) => {
  try {
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string
    return buyerNationalId
  } catch (error) {
    console.error(error)
    return ''
  }
}
