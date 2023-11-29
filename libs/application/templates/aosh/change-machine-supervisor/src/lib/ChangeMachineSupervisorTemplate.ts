import {
  getValueViaPath,
  pruneAfterDays,
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions, OperatorInformation, UserInformation } from '../shared'
import { ChangeOperatorOfVehicleSchema } from './dataSchema'
import { IdentityApi, UserProfileApi, MachinesApi } from '../dataProviders'
import { application as applicationMessage } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'
import { hasReviewerApproved } from '../utils'
import { AuthDelegationType } from '@island.is/shared/types'
import { Features } from '@island.is/feature-flags'
import { ApiScope } from '@island.is/auth/scopes'
import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  PendingAction,
  defineTemplateApi,
} from '@island.is/application/types'

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
  type: ApplicationTypes.CHANGE_MACHINE_SUPERVISOR,
  name: determineMessageFromApplicationAnswers,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.ChangeMachineSupervisor.translation,
  ],
  dataSchema: ChangeOperatorOfVehicleSchema,
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
          name: 'Breyting umráðamanns á tæki',
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
                import('../forms/ChangeMachineSupervisorForm/index').then(
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
              api: [IdentityApi, UserProfileApi, MachinesApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.REVIEW]: {
        entry: 'assignUsers',
        meta: {
          name: 'Breyting umráðamanns á tæki',
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
      reviewerNationalIdList.push(nationalId!)
      return nationalId
    })
    return reviewerNationalIdList
  } catch (error) {
    console.error(error)
    return []
  }
}
