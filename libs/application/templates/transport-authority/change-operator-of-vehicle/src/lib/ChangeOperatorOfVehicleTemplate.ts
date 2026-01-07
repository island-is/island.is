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
  getValueViaPath,
  pruneAfterDays,
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  getReviewStatePendingAction,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions, OperatorInformation, UserInformation } from '../shared'
import { ChangeOperatorOfVehicleSchema } from './dataSchema'
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
import {
  isRemovingOperatorOnly,
  getChargeItems,
  getExtraData,
  getReviewerRole,
  getReviewers,
} from '../utils'
import { AuthDelegationType } from '@island.is/shared/types'
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
  type: ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.ChangeOperatorOfVehicle.translation,
  ],
  dataSchema: ChangeOperatorOfVehicleSchema,
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
      { key: 'ownerCoOwner.$.nationalId', isListed: false },
      { key: 'ownerCoOwner.$.approved', isListed: false },
      { key: 'operators.$.nationalId', isListed: false },
      { key: 'operators.$.approved', isListed: false },
    ],
  },
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Breyting umráðamanns á ökutæki',
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
                import('../forms/ChangeOperatorOfVehicleForm/index').then(
                  (module) =>
                    Promise.resolve(module.ChangeOperatorOfVehicleForm),
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
        onExit: [
          defineTemplateApi({
            action: ApiActions.initReview,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
        submitTarget: [
          {
            target: States.COMPLETED,
            cond: isRemovingOperatorOnly,
          },
          { target: States.REVIEW },
        ],
      }),
      [States.REVIEW]: {
        entry: 'assignUsers',
        meta: {
          name: 'Breyting umráðamanns á ökutæki',
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
                  if (role === 'ownerCoOwner')
                    return applicationMessage.historyLogApprovedByCoOwner
                  else if (role === 'operators')
                    return applicationMessage.historyLogApprovedByNewOperator
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
                  if (role === 'ownerCoOwner')
                    return applicationMessage.historyLogRejectedByCoOwner
                  else if (role === 'operators')
                    return applicationMessage.historyLogRejectedByNewOperator
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
                nationalId,
                getReviewers(application.answers),
                true,
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
                answers: ['ownerCoOwner', 'operators', 'rejecter'],
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
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
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
      'ownerCoOwner',
      [],
    ) as UserInformation[]
    const operators = getValueViaPath(
      application.answers,
      'operators',
      [],
    ) as OperatorInformation[]
    ownerCoOwner?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    operators?.map(({ nationalId }) => {
      if (nationalId) reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    return reviewerNationalIdList
  } catch (error) {
    console.error(error)
    return []
  }
}
