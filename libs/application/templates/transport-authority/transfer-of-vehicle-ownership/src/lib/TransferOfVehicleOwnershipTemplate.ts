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
  getHistoryLogRejectedWithSubjectAndActor,
  getHistoryLogApprovedWithSubjectAndActor,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions } from '../shared'
import { AuthDelegationType } from '@island.is/shared/types'
import { TransferOfVehicleOwnershipSchema } from './dataSchema'
import { application as applicationMessage, information } from './messages'
import { CoOwnerAndOperator, UserInformation } from '../shared'
import { assign } from 'xstate'
import set from 'lodash/set'
import {
  IdentityApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
  MockableSamgongustofaPaymentCatalogApi,
  CurrentVehiclesApi,
  InsuranceCompaniesApi,
} from '../dataProviders'
import {
  getChargeItems,
  getExtraData,
  canReviewerApprove,
  getReviewers,
} from '../utils'
import { ApiScope } from '@island.is/auth/scopes'
import { buildPaymentState } from '@island.is/application/utils'
import { CodeOwners } from '@island.is/shared/constants'

const pruneInDaysAtMidnight = (application: Application, days: number) => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  const pruneDate = new Date(date)
  pruneDate.setUTCHours(23, 59, 59)
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
  if (nationalId) {
    if (nationalId === InstitutionNationalIds.SAMGONGUSTOFA) {
      return {
        title: corePendingActionMessages.waitingForReviewTitle,
        content: {
          ...corePendingActionMessages.whoNeedsToReviewDescription,
          values: {
            value: getReviewers(application.answers)
              .filter((x) => !x.hasApproved)
              .map((x) =>
                x.name ? `${x.name} (${x.nationalId})` : x.nationalId,
              )
              .join(', '),
          },
        },
        displayStatus: 'info',
      }
    } else if (canReviewerApprove(nationalId, application.answers)) {
      return {
        title: corePendingActionMessages.waitingForReviewTitle,
        content: corePendingActionMessages.youNeedToReviewDescription,
        displayStatus: 'warning',
      }
    }
  }
  return {
    title: corePendingActionMessages.waitingForReviewTitle,
    content: corePendingActionMessages.waitingForReviewDescription,
    displayStatus: 'info',
  }
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
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
    },
  ],
  requiredScopes: [ApiScope.samgongustofaVehicles],
  adminDataConfig: {
    answers: [
      {
        key: 'pickVehicle.plate',
        isListed: true,
        label: information.labels.pickVehicle.vehicle,
      },
      {
        key: 'buyer.nationalId',
        isListed: true,
        isNationalId: true,
        label: information.labels.buyer.title,
      },
      { key: 'buyer.approved', isListed: false },
      { key: 'buyerCoOwnerAndOperator.$.nationalId', isListed: false },
      { key: 'buyerCoOwnerAndOperator.$.approved', isListed: false },
      { key: 'sellerCoOwner.$.nationalId', isListed: false },
      { key: 'sellerCoOwner.$.approved', isListed: false },
    ],
  },
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
                MockableSamgongustofaPaymentCatalogApi,
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
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
        chargeItems: getChargeItems(),
        extraData: getExtraData,
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
                logMessage: getHistoryLogApprovedWithSubjectAndActor,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: getHistoryLogRejectedWithSubjectAndActor,
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
          onEntry: defineTemplateApi({
            action: ApiActions.addReview,
            shouldPersistToExternalData: true,
          }),
          // Note: only re-validating because it is possible to add buyerCoOwners and buyerOperators in this step
          onExit: defineTemplateApi({
            action: ApiActions.validateApplication,
          }),
          onDelete: defineTemplateApi({
            action: ApiActions.deleteApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ReviewSeller').then((module) =>
                  Promise.resolve(module.ReviewSellerForm),
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
              title: applicationMessage.historyLogSentApplication,
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
        if (nationalId) reviewerNationalIdList.push(nationalId)
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
        if (nationalId) reviewerNationalIdList.push(nationalId)
        return nationalId
      })
    return reviewerNationalIdList
  } catch (error) {
    console.error(error)
    return []
  }
}
