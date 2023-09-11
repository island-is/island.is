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
import { TransferOfVehicleOwnershipSchema } from './dataSchema'
import { application as applicationMessage } from './messages'
import { CoOwnerAndOperator, UserInformation } from '../shared'
import { assign } from 'xstate'
import set from 'lodash/set'
import {
  IdentityApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
  CurrentVehiclesApi,
  InsuranceCompaniesApi,
} from '../dataProviders'
import { hasReviewerApproved } from '../utils'
import { Features } from '@island.is/feature-flags'
import { ApiScope } from '@island.is/auth/scopes'

const pruneInDaysAtMidnight = (application: Application, days: number) => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  const pruneDate = new Date(date.toUTCString())
  pruneDate.setHours(23, 59, 59)
  return pruneDate
}

const determineMessageFromApplicationAnswers = (application: Application) => {
  const plate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    undefined,
  ) as string | undefined
  return {
    name: applicationMessage.name,
    value: plate ? `- ${plate}` : '',
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
  type: ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP,
  name: determineMessageFromApplicationAnswers,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.TransferOfVehicleOwnership.translation,
  ],
  dataSchema: TransferOfVehicleOwnershipSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
      featureFlag: Features.transportAuthorityApplicationsCustomDelegation,
    },
  ],
  requiredScopes: [ApiScope.samgongustofaVehicles],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Tilkynning um eigendaskipti að ökutæki',
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
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.validateApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/TransferOfVehicleOwnershipForm/index').then(
                  (module) =>
                    Promise.resolve(module.TransferOfVehicleOwnershipForm),
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
                SamgongustofaPaymentCatalogApi,
                CurrentVehiclesApi,
                InsuranceCompaniesApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Greiðsla',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPayment,
              variant: 'red',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentAccepted,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: coreHistoryMessages.paymentCancelled,
                onEvent: DefaultEvents.ABORT,
              },
            ],
            pendingAction: {
              title: corePendingActionMessages.paymentPendingTitle,
              content: corePendingActionMessages.paymentPendingDescription,
              displayStatus: 'warning',
            },
          },
          progress: 0.4,
          lifecycle: pruneAfterDays(1 / 24),
          onEntry: defineTemplateApi({
            action: ApiActions.createCharge,
          }),
          onExit: defineTemplateApi({
            action: ApiActions.initReview,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) => val.Payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.REVIEW },
          [DefaultEvents.ABORT]: { target: States.DRAFT },
        },
      },
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
          progress: 0.65,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAtMidnight(application, 7),
            shouldDeleteChargeIfPaymentFulfilled: true,
          },
          onEntry: defineTemplateApi({
            action: ApiActions.addReview,
            shouldPersistToExternalData: true,
          }),
          onExit: defineTemplateApi({
            action: ApiActions.validateApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Review').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              write: {
                answers: [
                  'sellerCoOwner',
                  'buyer',
                  'buyerCoOwnerAndOperator',
                  'insurance',
                  'rejecter',
                ],
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
                answers: [
                  'sellerCoOwner',
                  'buyer',
                  'buyerCoOwnerAndOperator',
                  'buyerMainOperator',
                  'insurance',
                  'rejecter',
                ],
              },
              read: 'all',
            },
            {
              id: Roles.REVIEWER,
              formLoader: () =>
                import('../forms/Review').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              write: {
                answers: [
                  'sellerCoOwner',
                  'buyerCoOwnerAndOperator',
                  'rejecter',
                ],
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
          progress: 1,
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
            {
              id: Roles.REVIEWER,
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
          progress: 1,
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
              id: Roles.REVIEWER,
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

        const assigneeNationalIds = getNationalIdListOfReviewers(application)
        if (assigneeNationalIds.length > 0) {
          set(application, 'assignees', assigneeNationalIds)
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
    const reviewerNationalIdList = [] as string[]
    const sellerCoOwner = getValueViaPath(
      application.answers,
      'sellerCoOwner',
      [],
    ) as UserInformation[]
    const buyerCoOwnerAndOperator = getValueViaPath(
      application.answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
    sellerCoOwner?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    buyerCoOwnerAndOperator
      ?.filter(({ wasRemoved }) => wasRemoved !== 'true')
      .map(({ nationalId }) => {
        reviewerNationalIdList.push(nationalId!)
        return nationalId
      })
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (id === buyerNationalId && application.assignees.includes(id)) {
      return Roles.BUYER
    }
    if (
      reviewerNationalIdList.includes(id) &&
      application.assignees.includes(id)
    ) {
      return Roles.REVIEWER
    }
    return undefined
  },
}

export default template

const getNationalIdListOfReviewers = (application: Application) => {
  try {
    const reviewerNationalIdList = [] as string[]
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string
    reviewerNationalIdList.push(buyerNationalId)
    const sellerCoOwner = getValueViaPath(
      application.answers,
      'sellerCoOwner',
      [],
    ) as UserInformation[]
    const buyerCoOwnerAndOperator = getValueViaPath(
      application.answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
    sellerCoOwner?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    buyerCoOwnerAndOperator
      ?.filter(({ wasRemoved }) => wasRemoved !== 'true')
      .map(({ nationalId }) => {
        reviewerNationalIdList.push(nationalId!)
        return nationalId
      })
    return reviewerNationalIdList
  } catch (error) {
    console.error(error)
    return []
  }
}
