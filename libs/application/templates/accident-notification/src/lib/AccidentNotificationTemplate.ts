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
// import * as z from 'zod'
import { States } from '../constants'
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
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.REJECT }
  | { type: 'COMMENT' }

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
          /* onExit: {
            apiModuleAction: ApiActions.submitApplication,
          }, */
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
          SUBMIT: {
            target: States.NEEDS_DOCUMENT_AND_REVIEW,
          },
        },
      },
      [States.NEEDS_DOCUMENT_AND_REVIEW]: {
        meta: {
          name: States.NEEDS_DOCUMENT_AND_REVIEW,
          progress: 0.4,
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
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.ADD_DOCUMENTS,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.OVERVIEW,
          },
        },
      },
      [States.NEEDS_DOCUMENT]: {
        meta: {
          name: States.NEEDS_DOCUMENT,
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
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.ADD_DOCUMENTS,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.OVERVIEW,
          },
        },
      },
      [States.NEEDS_REVIEW]: {
        meta: {
          name: States.NEEDS_REVIEW,
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
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.ADD_DOCUMENTS,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.OVERVIEW,
          },
        },
      },
      [States.ADD_DOCUMENTS]: {
        meta: {
          name: States.ADD_DOCUMENTS,
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
                import('../forms/AddDocuments').then((val) =>
                  Promise.resolve(val.AddDocuments),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.NEEDS_REVIEW,
          },
        },
      },
      [States.THIRD_PARTY_COMMENT]: {
        meta: {
          name: States.THIRD_PARTY_COMMENT,
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
                import('../forms/ThirdPartyComment').then((val) =>
                  Promise.resolve(val.ThirdPartyComment),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ThirdPartyComment').then((val) =>
                  Promise.resolve(val.ThirdPartyComment),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.ADD_DOCUMENTS,
          },
          COMMENT: {
            target: States.THIRD_PARTY_COMMENT,
          },
          // TODO: Add rejected review state
          [DefaultEvents.REJECT]: {
            target: States.NEEDS_REVIEW,
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
          },
        },
      },
      [States.OVERVIEW]: {
        meta: {
          name: States.OVERVIEW,
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
                import('../forms/Overview').then((val) =>
                  Promise.resolve(val.Overview),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ThirdPartyOverview').then((val) =>
                  Promise.resolve(val.ThirdPartyOverview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.NEEDS_REVIEW,
          },
          [DefaultEvents.EDIT]: {
            target: States.ADD_DOCUMENTS,
          },
          COMMENT: {
            target: States.THIRD_PARTY_COMMENT,
          },
          // TODO: Add rejected review state
          [DefaultEvents.REJECT]: {
            target: States.NEEDS_REVIEW,
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
          },
        },
      },
      [States.IN_FINAL_REVIEW]: {
        meta: {
          name: States.IN_FINAL_REVIEW,
          progress: 0.8,
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
          ],
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
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    return undefined
  },
}

export default AccidentNotificationTemplate
