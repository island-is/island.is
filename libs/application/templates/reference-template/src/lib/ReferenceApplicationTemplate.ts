import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationConfigurations,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { m } from './messages'
import { assign } from 'xstate'
import { ExampleSchema } from './dataSchema'

const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  inReview: 'inReview',
  approved: 'approved',
  rejected: 'rejected',
  waitingToAssign: 'waitingToAssign',
}

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const determineMessageFromApplicationAnswers = (application: Application) => {
  const careerHistory = getValueViaPath(
    application.answers,
    'careerHistory',
    undefined,
  ) as string | undefined
  if (careerHistory === 'no') {
    return m.nameApplicationNeverWorkedBefore
  }
  return m.name
}

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.EXAMPLE,
  name: determineMessageFromApplicationAnswers,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: 'Umsókn um ökunám',
          actionCard: {
            description: m.draftDescription,
          },
          progress: 0.25,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ExampleForm').then((module) =>
                  Promise.resolve(module.ExampleForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.waitingToAssign,
            },
          ],
        },
      },
      [States.waitingToAssign]: {
        meta: {
          name: 'Waiting to assign',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          status: 'inprogress',
          onEntry: {
            apiModuleAction: ApiActions.createApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/WaitingToAssign').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/WaitingToAssign').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: { target: States.inReview },
          ASSIGN: { target: States.inReview },
          EDIT: { target: States.draft },
        },
      },
      [States.inReview]: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          onExit: {
            apiModuleAction: ApiActions.completeApplication,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
              write: 'all',
              read: 'all',
              shouldBeListedForRole: false,
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: { target: States.approved },
          REJECT: { target: States.rejected },
        },
      },
      [States.approved]: {
        meta: {
          name: 'Approved',
          progress: 1,
          status: 'approved',
          lifecycle: DefaultStateLifeCycle,
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
      },
      [States.rejected]: {
        meta: {
          name: 'Rejected',
          progress: 1,
          status: 'rejected',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }
    if (application.applicant === nationalId) {
      if (application.state === 'inReview') {
        return Roles.ASSIGNEE
      }

      return Roles.APPLICANT
    }
  },
}

export default ReferenceApplicationTemplate
