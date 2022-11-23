import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import { getValueViaPath, pruneAfterDays } from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions } from '../shared'
import { Features } from '@island.is/feature-flags'
import { TransferOfVehicleOwnershipSchema } from './dataSchema'
import { application } from './messages'
import { CoOwnerAndOperator, UserInformation } from '../types'
import { assign } from 'xstate'
import set from 'lodash/set'

const pruneInDaysATen = (application: Application, days: number) => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  const pruneDate = new Date(date.toUTCString())
  pruneDate.setHours(10, 0, 0)
  console.log(pruneDate)
  return pruneDate // Time left of the day + 6 more days
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP,
  name: application.name,
  institution: application.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.TransferOfVehicleOwnership.translation,
  ],
  dataSchema: TransferOfVehicleOwnershipSchema,
  featureFlag: Features.transportAuthorityTransferOfVehicleOwnership,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Tilkynning um eigendaskipti að ökutæki',
          actionCard: {
            tag: {
              label: application.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: pruneAfterDays(1),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/TransferOfVehicleOwnershipForm/index'
                ).then((module) =>
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
          actionCard: {
            tag: {
              label: application.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.4,
          lifecycle: pruneAfterDays(1 / 24),
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          onExit: {
            apiModuleAction: ApiActions.initReview,
          },
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
          actionCard: {
            tag: {
              label: application.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.65,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysATen(application, 8),
          },
          onEntry: {
            apiModuleAction: ApiActions.addReview,
            shouldPersistToExternalData: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Review').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              write: {
                answers: [],
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
                  'buyerCoOwnerAndOperator',
                  'insurance',
                  'buyer',
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
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          /* onEntry: {
            apiModuleAction: ApiActions.rejectApplication,
          }, */
          actionCard: {
            tag: {
              label: application.actionCardRejected,
              variant: 'blueberry',
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
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          /* onEntry: {
            apiModuleAction: ApiActions.submitApplication,
          }, */
          actionCard: {
            tag: {
              label: application.actionCardDone,
              variant: 'blueberry',
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
              delete: true,
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
        type: 'final' as const,
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
    buyerCoOwnerAndOperator?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    console.log(application.answers)
    console.log(id, buyerNationalId)
    console.log(reviewerNationalIdList)
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
    buyerCoOwnerAndOperator?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    return reviewerNationalIdList
  } catch (error) {
    console.log(error)
    return []
  }
}
