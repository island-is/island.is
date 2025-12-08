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
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  getReviewStatePendingAction,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import {
  ApiActions,
  OwnerCoOwnersInformation,
  UserInformation,
} from '../shared'
import { ChangeCoOwnerOfVehicleSchema } from './dataSchema'
import {
  IdentityApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
  CurrentVehiclesApi,
  MockableSamgongustofaPaymentCatalogApi,
} from '../dataProviders'
import { application as applicationMessage, information } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  getChargeItems,
  getExtraData,
  getReviewerRole,
  getReviewers,
  hasReviewerApproved,
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

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.ChangeCoOwnerOfVehicle.translation,
  ],
  dataSchema: ChangeCoOwnerOfVehicleSchema,
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
      { key: 'ownerCoOwners.$.nationalId', isListed: false },
      { key: 'ownerCoOwners.$.approved', isListed: false },
      { key: 'coOwners.$.nationalId', isListed: false },
      { key: 'coOwners.$.approved', isListed: false },
    ],
  },
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Breyting meðeiganda á ökutæki',
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
                import('../forms/ChangeCoOwnerOfVehicleForm/index').then(
                  (module) =>
                    Promise.resolve(module.ChangeCoOwnerOfVehicleForm),
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
        chargeItems: getChargeItems,
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
          name: 'Breyting meðeiganda á ökutæki',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: (application, subjectNationalId) => {
                  if (!subjectNationalId)
                    return coreHistoryMessages.applicationApprovedBy

                  const role = getReviewerRole(
                    application.answers,
                    subjectNationalId,
                  )
                  if (role === 'ownerCoOwners')
                    return applicationMessage.historyLogApprovedByOldCoOwner
                  else if (role === 'coOwners')
                    return applicationMessage.historyLogApprovedByNewCoOwner
                  return coreHistoryMessages.applicationApprovedBy
                },
                includeSubjectAndActor: true,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: (application, subjectNationalId) => {
                  if (!subjectNationalId)
                    return coreHistoryMessages.applicationRejected

                  const role = getReviewerRole(
                    application.answers,
                    subjectNationalId,
                  )
                  if (role === 'ownerCoOwners')
                    return applicationMessage.historyLogRejectedByOldCoOwner
                  else if (role === 'coOwners')
                    return applicationMessage.historyLogRejectedByNewCoOwner
                  return coreHistoryMessages.applicationRejected
                },
                includeSubjectAndActor: true,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationApproved,
              },
            ],
            pendingAction: (application, _role, nationalId) => {
              return getReviewStatePendingAction(
                hasReviewerApproved(application.answers, nationalId),
                getReviewers(application.answers),
              )
            },
          },
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAtMidnight(application, 7),
            shouldDeleteChargeIfPaymentFulfilled: true,
          },
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
                answers: [],
              },
              read: 'all',
              delete: true,
            },
            {
              id: Roles.REVIEWER,
              formLoader: () =>
                import('../forms/Review').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              write: {
                answers: ['ownerCoOwners', 'coOwners', 'rejecter'],
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
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
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
    const reviewerNationalIdList = getNationalIdListOfReviewers(application)
    if (id === application.applicant) {
      return Roles.APPLICANT
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
    const ownerCoOwner = getValueViaPath(
      application.answers,
      'ownerCoOwners',
      [],
    ) as UserInformation[]
    const coOwners = getValueViaPath(
      application.answers,
      'coOwners',
      [],
    ) as OwnerCoOwnersInformation[]
    ownerCoOwner?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    coOwners
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
