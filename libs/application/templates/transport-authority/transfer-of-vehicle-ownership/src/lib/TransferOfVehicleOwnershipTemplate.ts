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
import {
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions } from '../shared'
import { Features } from '@island.is/feature-flags'
import { TransferOfVehicleOwnershipSchema } from './dataSchema'
import { application } from './messages'

const pruneInDaysAtMidnight = (application: Application, days: number) => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  // const utcDate = new Date(date.toUTCString()) // In case user is not on GMT
  const midnightDate = new Date(date.toUTCString())
  midnightDate.setHours(23, 59, 59)
  // const timeToPrune = midnightDate.getTime() - utcDate.getTime()
  return midnightDate // Time left of the day + 6 more days
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
          lifecycle: EphemeralStateLifeCycle,
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
          // TODOx payment step disabled while ark is not working
          // [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
          [DefaultEvents.SUBMIT]: { target: States.REVIEW },
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
          progress: 0.8,
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
        // TODO
        meta: {
          name: 'Tilkynning um eigendaskipti að ökutæki',
          actionCard: {
            tag: {
              label: application.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: (application: Application) =>
              pruneInDaysAtMidnight(application, 3),
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
          [DefaultEvents.SUBMIT]: { target: States.REVIEW },
        },
      },
      // [States.REJECTED]: {
      //   meta: {
      //     name: 'Rejected',
      //     progress: 1,
      //     lifecycle: pruneAfterDays(3 * 30),
      //     onEntry: {
      //       apiModuleAction: ApiActions.rejectApplication,
      //     },
      //     actionCard: {
      //       tag: {
      //         label: application.actionCardRejected,
      //         variant: 'blueberry',
      //       },
      //     },
      //     roles: [
      //       {
      //         id: Roles.APPLICANT,
      //         formLoader: () =>
      //           import('../forms/Rejected').then((val) =>
      //             Promise.resolve(val.Approved),
      //           ),
      //         read: 'all',
      //       },
      //     ],
      //   },
      // },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
          },
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
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
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
