import { assign } from 'xstate'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiModuleActions } from '../../constants'
import { dataSchema } from './dataSchema'
import { CodeOwners } from '@island.is/shared/constants'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
enum States {
  DRAFT = 'draft',
  REVIEWER_WAITING_TO_ASSIGN = 'reviewerWaitingToAssign',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  TEST_PHASE = 'testPhase',
  REJECTED = 'rejected',
  FINISHED = 'finished',
}

const DocumentProviderOnboardingTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Umsókn um að gerast skjalaveitandi',
  codeOwner: CodeOwners.Hugsmidjan,
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn skjalaveitu',
          progress: 0.25,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DocumentProviderApplication').then((val) =>
                  Promise.resolve(val.DocumentProviderOnboarding),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEWER_WAITING_TO_ASSIGN,
          },
        },
      },
      [States.REVIEWER_WAITING_TO_ASSIGN]: {
        meta: {
          name: 'Waiting to assign reviewer',
          progress: 0.4,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignReviewer,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.IN_REVIEW },
        },
      },
      [States.IN_REVIEW]: {
        exit: 'clearAssignees',
        meta: {
          name: States.IN_REVIEW,
          status: 'inprogress',
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Hafna', type: 'reject' },
              ],
              read: 'all',
              write: { answers: ['rejectionReason'] },
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
          [DefaultEvents.APPROVE]: { target: States.TEST_PHASE },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          status: 'rejected',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.applicationRejected,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.TEST_PHASE]: {
        meta: {
          name: 'TestPhase',
          status: 'inprogress',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.applicationApproved,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/TestPhase').then((val) =>
                  Promise.resolve(val.TestPhase),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: [States.FINISHED],
          },
        },
      },
      [States.FINISHED]: {
        meta: {
          status: 'completed',
          name: 'Finished',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Finished').then((val) =>
                  Promise.resolve(val.Finished),
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
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    //This logic makes it so the application is not accessible to anybody but involved parties

    // This if statement might change depending on the "umboðskerfi"
    if (
      process.env.NODE_ENV === 'development' &&
      application.state === 'inReview'
    ) {
      return Roles.ASSIGNEE
    }
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    //Returns nothing if user is not same as applicant nor is part of the assignes
    return undefined
  },
}

export default DocumentProviderOnboardingTemplate
