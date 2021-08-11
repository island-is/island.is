import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import * as z from 'zod'
import { States } from '../constants'
import { application } from './messages'
// import { AccidentNotificationSchema } from './dataSchema'

const AccidentNotificationSchema = z.object({})

const AccidentNotificationStates = {
  draft: 'draft',
  submitted: 'submitted',
}

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

type AccidentNotificationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

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
    initial: States.NEEDS_DOCUMENT_AND_REVIEW,
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
              id: 'applicant',
              formLoader: () =>
                import('../forms/AccidentNotificationForm').then((val) =>
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
          SUBMIT: {
            target: States.NEEDS_DOCUMENT_AND_REVIEW,
          },
        },
      },
      [States.NEEDS_DOCUMENT_AND_REVIEW]: {
        meta: {
          name: application.deliveryOfData.name.defaultMessage,
          progress: 0.4,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.NEEDS_DOCUMENT,
          },
        },
      },
      [States.NEEDS_DOCUMENT]: {
        meta: {
          name: application.deliveryOfData.name.defaultMessage,
          progress: 0.6,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              actions: [{ event: 'SUBMIT', name: ' ', type: 'primary' }],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
        },
      },
      [States.NEEDS_REVIEW]: {
        meta: {
          name: application.deliveryOfData.name.defaultMessage,
          progress: 0.6,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              actions: [{ event: 'SUBMIT', name: ' ', type: 'primary' }],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
        },
      },
      [States.IN_FINAL_REVIEW]: {
        meta: {
          name: application.deliveryOfData.name.defaultMessage,
          progress: 0.6,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              actions: [{ event: 'SUBMIT', name: ' ', type: 'primary' }],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
        },
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

export default AccidentNotificationTemplate
