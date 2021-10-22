import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/core'
import set from 'lodash/set'
import { assign } from 'xstate'
// import * as z from 'zod'
import { States } from '../constants'
import { ApiActions } from '../shared'
import { AccidentNotificationSchema } from './dataSchema'
import { application } from './messages'

// Uncomment for empty data schema
// const AccidentNotificationSchema = z.object({})

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

type AccidentNotificationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ASSIGN }

const AccidentNotificationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<AccidentNotificationEvent>,
  AccidentNotificationEvent
> = {
  type: ApplicationTypes.ACCIDENT_NOTIFICATION,
  name: application.general.name,
  institution: application.general.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.AccidentNotification.translation,
  ],
  dataSchema: AccidentNotificationSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 0.2,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/AccidentNotificationForm/index').then((val) =>
                  Promise.resolve(val.AccidentNotificationForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW,
          },
        },
      },
      [States.REVIEW]: {
        meta: {
          name: States.REVIEW,
          progress: 0.6,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: {
            target: States.REVIEW_WITH_REVIEWER,
          },
        },
      },
      [States.REVIEW_WITH_REVIEWER]: {
        meta: {
          name: States.REVIEW_WITH_REVIEWER,
          progress: 0.6,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/AssigneeInReview').then((val) =>
                  Promise.resolve(val.AssigneeInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.REJECT]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'rejectApplication',
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'approveApplication',
          },
        },
      },
      // State when assignee has approved or reject the appliction
      [States.IN_FINAL_REVIEW]: {
        meta: {
          name: States.IN_FINAL_REVIEW,
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
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
      approveApplication: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'reviewerApproved', true)

        return context
      }),
      rejectApplication: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'reviewerApproved', false)

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    return undefined
  },
}

export default AccidentNotificationTemplate
