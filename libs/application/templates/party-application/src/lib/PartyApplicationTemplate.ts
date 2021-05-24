import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { dataSchema } from './dataSchema'
import { assign } from 'xstate'
import { API_MODULE_ACTIONS, States, Roles } from '../constants'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.EDIT }

const PartyApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARTY_APPLICATION,
  name: 'Framboð',
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConstituencyForm').then((module) =>
                  Promise.resolve(module.ConstituencyForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja söfnun',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COLLECT_ENDORSEMENTS,
          },
        },
      },
      [States.COLLECT_ENDORSEMENTS]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.CreateEndorsementList,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsementsForm').then((val) =>
                  Promise.resolve(val.CollectEndorsementsForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementApplication),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToSupremeCourt',
        exit: 'clearAssignees',
        meta: {
          name: 'In Review',
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.AssignSupremeCourt,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Hafna', type: 'reject' },
              ],
              write: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConstituencyForm').then((module) =>
                  Promise.resolve(module.ConstituencyForm),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.APPROVED,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.ApplicationRejected,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsementsForm').then((val) =>
                  Promise.resolve(val.CollectEndorsementsForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementApplication),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.ApplicationApproved,
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
  stateMachineOptions: {
    actions: {
      assignToSupremeCourt: assign((context) => {
        return {
          ...context,
          application: {
            ...context.application,
            // todo: get list of supreme court national ids
            assignees: ['3105913789'],
          },
        }
      }),
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
    // todo map to supreme court natioanl ids
    if (application.assignees.includes('3105913789')) {
      return Roles.ASSIGNEE
    }
    // TODO: Applicant can recommend his own list
    else if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (application.state === States.COLLECT_ENDORSEMENTS) {
      // TODO: Maybe display collection as closed in final state for signaturee
      // everyone can be signaturee if they are not the applicant
      return Roles.SIGNATUREE
    } else {
      return undefined
    }
  },
}

export default PartyApplicationTemplate
